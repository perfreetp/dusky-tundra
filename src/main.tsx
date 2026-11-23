import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// 不使用 StrictMode：WebGPU 渲染场景持有 GPU 资源与 rAF 生命周期，
// 双挂载会创建两个场景实例并废弃首个，可视化应用需要严格单次挂载语义。
createRoot(document.getElementById('root')!).render(<App />);
