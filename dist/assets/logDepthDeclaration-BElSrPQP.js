import{S as e}from"./index-DJJPQl6S.js";const o="sceneUboDeclaration",i=`layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;};
`;e.IncludesShadersStore[o]||(e.IncludesShadersStore[o]=i);const n="meshUboDeclaration",r=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;e.IncludesShadersStore[n]||(e.IncludesShadersStore[n]=r);const t="mainUVVaryingDeclaration",s=`#ifdef MAINUV{X}
varying vec2 vMainUV{X};
#endif
`;e.IncludesShadersStore[t]||(e.IncludesShadersStore[t]=s);const a="logDepthDeclaration",d=`#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;varying float vFragmentDepth;
#endif
`;e.IncludesShadersStore[a]||(e.IncludesShadersStore[a]=d);
