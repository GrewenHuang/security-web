// 引入 echarts 核心模块
import * as echarts from 'echarts/core';
// 引入图表组件
import { 
    PieChart ,
    LineChart,
    BarChart,
    MapChart,
    ScatterChart,
    EffectScatterChart,
} from 'echarts/charts';
// 引入 提示框、标题、直角坐标系等组件
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    GraphicComponent,
    GeoComponent,
    DataZoomComponent
} from 'echarts/components';

// 引入 Canvas 渲染器
import { 
    CanvasRenderer,
    
} from 'echarts/renderers';

echarts.use([
    PieChart,
    LineChart,
    BarChart,
    MapChart,
    ScatterChart,
    EffectScatterChart,

    CanvasRenderer,

    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    GraphicComponent,
    GeoComponent,
    DataZoomComponent
]);
export default echarts;
