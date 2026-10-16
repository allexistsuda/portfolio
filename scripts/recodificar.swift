// Recodifica um .mp4 baixando a taxa de bits, usando AVFoundation — o par do codificar.swift,
// para quando a fonte já é vídeo e não uma pasta de quadros. Mantém resolução e fps.
//
//   swift scripts/recodificar.swift entrada.mp4 saida.mp4 <bitrate>

import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 4 else {
    FileHandle.standardError.write("uso: recodificar <entrada.mp4> <saida.mp4> <bitrate>\n".data(using: .utf8)!)
    exit(1)
}
let entrada = URL(fileURLWithPath: args[1])
let saida = URL(fileURLWithPath: args[2])
let bitrate = Int(args[3]) ?? 2_500_000

let asset = AVAsset(url: entrada)
let sem = DispatchSemaphore(value: 0)
var trilha: AVAssetTrack?
var tamanho = CGSize.zero
var fps: Float = 30

asset.loadValuesAsynchronously(forKeys: ["tracks"]) {
    trilha = asset.tracks(withMediaType: .video).first
    if let t = trilha { tamanho = t.naturalSize; fps = t.nominalFrameRate }
    sem.signal()
}
sem.wait()
guard let t = trilha else { FileHandle.standardError.write("sem trilha de vídeo\n".data(using: .utf8)!); exit(1) }

let L = Int(abs(tamanho.width)), A = Int(abs(tamanho.height))
try? FileManager.default.removeItem(at: saida)

let reader = try AVAssetReader(asset: asset)
let saidaTrilha = AVAssetReaderTrackOutput(track: t, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)
])
reader.add(saidaTrilha)

let writer = try AVAssetWriter(outputURL: saida, fileType: .mp4)
let entradaW = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: L,
    AVVideoHeightKey: A,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        // keyframe a cada 2 s: peça longa que alguém pode arrastar, diferente do loop curto
        AVVideoMaxKeyFrameIntervalKey: Int(fps * 2),
    ],
])
entradaW.expectsMediaDataInRealTime = false
writer.add(entradaW)

writer.startWriting()
writer.startSession(atSourceTime: .zero)
reader.startReading()

let fila = DispatchQueue(label: "recod")
let fim = DispatchSemaphore(value: 0)
var n = 0
entradaW.requestMediaDataWhenReady(on: fila) {
    while entradaW.isReadyForMoreMediaData {
        guard let buf = saidaTrilha.copyNextSampleBuffer() else {
            entradaW.markAsFinished(); writer.finishWriting { fim.signal() }; return
        }
        entradaW.append(buf); n += 1
        if n % 300 == 0 { print("  \(n) quadros"); fflush(stdout) }
    }
}
fim.wait()

let bytes = try? FileManager.default.attributesOfItem(atPath: saida.path)[.size] as? Int
print("  \(saida.lastPathComponent): \(n) quadros · \(L)x\(A) · \(Int(fps))fps · \((bytes ?? 0) / 1024 / 1024) MB")
