// Monta um .mp4 H.264 a partir de uma pasta de PNGs, usando AVFoundation — que já vem no macOS.
// É o substituto do ffmpeg aqui: nenhuma dependência pra instalar.
//
//   swift scripts/codificar.swift renders/frames renders/invest-motion.mp4 30

import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

let args = CommandLine.arguments
guard args.count >= 4 else {
    FileHandle.standardError.write("uso: codificar <pastaDeQuadros> <saida.mp4> <fps> [quadrosPorKeyframe]\n".data(using: .utf8)!)
    exit(1)
}
let pasta = URL(fileURLWithPath: args[1])
let saida = URL(fileURLWithPath: args[2])
let fps = Int32(args[3]) ?? 30
// Intervalo entre keyframes, em quadros. O padrão é 1 por segundo, que serve pra vídeo
// que alguém arrasta. Peça em loop na página não é arrastada: cada keyframe é um quadro
// inteiro recomprimido, e numa arte detalhada e quase parada eles viram o peso do arquivo.
let gop = args.count >= 5 ? (Int(args[4]) ?? Int(fps)) : Int(fps)
// Taxa de bits alvo. 14 Mbps serve pra captura de tela com muito movimento; peça em loop
// com a maior parte do quadro parada gasta muito menos e o teto só infla o arquivo.
let bitrate = args.count >= 6 ? (Int(args[5]) ?? 14_000_000) : 14_000_000

let fm = FileManager.default
let quadros = (try fm.contentsOfDirectory(at: pasta, includingPropertiesForKeys: nil))
    .filter { $0.pathExtension.lowercased() == "png" }
    .sorted { $0.lastPathComponent < $1.lastPathComponent }

guard let primeiro = quadros.first,
      let fonte = CGImageSourceCreateWithURL(primeiro as CFURL, nil),
      let img0 = CGImageSourceCreateImageAtIndex(fonte, 0, nil) else {
    FileHandle.standardError.write("nenhum quadro em \(pasta.path)\n".data(using: .utf8)!)
    exit(1)
}
let L = img0.width, A = img0.height

try? fm.removeItem(at: saida)
let writer = try AVAssetWriter(outputURL: saida, fileType: .mp4)
let entrada = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: L,
    AVVideoHeightKey: A,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: gop,
    ],
    // Sem isto o arquivo sai sem etiqueta de cor, e aí cada player adivinha a faixa:
    // o encoder grava em faixa limitada, o navegador expande como se fosse cheia, e a
    // imagem inteira chega uns 3 níveis mais escura que o PNG de origem. Declarando
    // Rec. 709 explicitamente, decodificador nenhum precisa chutar.
    AVVideoColorPropertiesKey: [
        AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
        AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
        AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
    ],
])
entrada.expectsMediaDataInRealTime = false
let adaptador = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: entrada, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
    kCVPixelBufferWidthKey as String: L,
    kCVPixelBufferHeightKey as String: A,
])
writer.add(entrada)
guard writer.startWriting() else {
    FileHandle.standardError.write("falhou ao abrir o arquivo: \(writer.error?.localizedDescription ?? "?")\n".data(using: .utf8)!)
    exit(1)
}
writer.startSession(atSourceTime: .zero)

let espaco = CGColorSpaceCreateDeviceRGB()
let bitmap = CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue

for (i, url) in quadros.enumerated() {
    guard let s = CGImageSourceCreateWithURL(url as CFURL, nil),
          let img = CGImageSourceCreateImageAtIndex(s, 0, nil),
          let pool = adaptador.pixelBufferPool else { continue }
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &pb)
    guard let buffer = pb else { continue }
    CVPixelBufferLockBaseAddress(buffer, [])
    if let ctx = CGContext(data: CVPixelBufferGetBaseAddress(buffer), width: L, height: A,
                           bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
                           space: espaco, bitmapInfo: bitmap) {
        ctx.draw(img, in: CGRect(x: 0, y: 0, width: L, height: A))
    }
    CVPixelBufferUnlockBaseAddress(buffer, [])
    while !entrada.isReadyForMoreMediaData { usleep(2000) }
    adaptador.append(buffer, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: fps))
    if i % 60 == 0 { print("  \(i)/\(quadros.count)") }
}

entrada.markAsFinished()
let trava = DispatchSemaphore(value: 0)
writer.finishWriting { trava.signal() }
trava.wait()

if writer.status == .completed {
    let bytes = (try? fm.attributesOfItem(atPath: saida.path)[.size] as? Int) ?? 0
    print("  \(saida.lastPathComponent): \(quadros.count) quadros · \(L)x\(A) · \(fps)fps · \((bytes ?? 0) / 1024 / 1024) MB")
} else {
    FileHandle.standardError.write("falhou: \(writer.error?.localizedDescription ?? "?")\n".data(using: .utf8)!)
    exit(1)
}
