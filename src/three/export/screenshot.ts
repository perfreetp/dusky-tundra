/**
 * PNG 截图导出。preserveDrawingBuffer 已在 Engine 开启，同帧 toDataURL 即可。
 */
import { downloadDataUrl } from '../../core/io/poseSerializer';

export function exportScreenshot(dataUrl: string, filename = `rope-pose-${Date.now()}.png`): void {
  downloadDataUrl(dataUrl, filename);
}
