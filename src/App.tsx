import Toolbar from './components/Toolbar';
import Viewport from './components/Viewport';
import SpeakerPanel from './components/SpeakerPanel';
import GridPanel from './components/GridPanel';
import ComparePanel from './components/ComparePanel';
import Legend from './components/Legend';

export default function App() {
  return (
    <div class="app">
      <Toolbar />
      <div class="main">
        <div class="stage">
          <Viewport />
          <Legend />
        </div>
        <aside class="sidebar">
          <SpeakerPanel />
          <GridPanel />
          <ComparePanel />
          <div class="sidebar-hint">
            提示：拖动音箱可水平移动；高度、朝向、张角在参数面板精确编辑。
          </div>
        </aside>
      </div>
    </div>
  );
}
