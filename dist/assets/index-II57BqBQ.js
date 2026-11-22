var Yg=Object.defineProperty;var Kg=(n,e,t)=>e in n?Yg(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var sa=(n,e,t)=>Kg(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
* @vue/shared v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function zu(n){const e=Object.create(null);for(const t of n.split(","))e[t]=1;return t=>t in e}const Gt={},$r=[],wi=()=>{},rp=()=>!1,dl=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&(n.charCodeAt(2)>122||n.charCodeAt(2)<97),pl=n=>n.startsWith("onUpdate:"),un=Object.assign,Hu=(n,e)=>{const t=n.indexOf(e);t>-1&&n.splice(t,1)},Zg=Object.prototype.hasOwnProperty,Ct=(n,e)=>Zg.call(n,e),at=Array.isArray,yr=n=>Ys(n)==="[object Map]",Fs=n=>Ys(n)==="[object Set]",Oh=n=>Ys(n)==="[object Date]",pt=n=>typeof n=="function",nn=n=>typeof n=="string",Ri=n=>typeof n=="symbol",zt=n=>n!==null&&typeof n=="object",sp=n=>(zt(n)||pt(n))&&pt(n.then)&&pt(n.catch),op=Object.prototype.toString,Ys=n=>op.call(n),Jg=n=>Ys(n).slice(8,-1),ap=n=>Ys(n)==="[object Object]",Gu=n=>nn(n)&&n!=="NaN"&&n[0]!=="-"&&""+parseInt(n,10)===n,yo=zu(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Qg=1e4,ml=n=>{let e=Object.create(null),t=0;return(i=>{const r=e[i];return r!==void 0?r:(++t>Qg&&(e=Object.create(null),t=1),e[i]=n(i))})},e_=/-\w/g,ci=ml(n=>n.replace(e_,e=>e.slice(1).toUpperCase())),t_=/\B([A-Z])/g,ns=ml(n=>n.replace(t_,"-$1").toLowerCase()),lp=ml(n=>n.charAt(0).toUpperCase()+n.slice(1)),Vl=ml(n=>n?`on${lp(n)}`:""),Ei=(n,e)=>!Object.is(n,e),ka=(n,...e)=>{for(let t=0;t<n.length;t++)n[t](...e)},cp=(n,e,t,i=!1)=>{Object.defineProperty(n,e,{configurable:!0,enumerable:!1,writable:i,value:t})},Wu=n=>{const e=parseFloat(n);return isNaN(e)?n:e};let Bh;const gl=()=>Bh||(Bh=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Xo(n){if(at(n)){const e={};for(let t=0;t<n.length;t++){const i=n[t],r=nn(i)?s_(i):Xo(i);if(r)for(const s in r)e[s]=r[s]}return e}else if(nn(n)||zt(n))return n}const n_=/;(?![^(]*\))/g,i_=/:([^]+)/,r_=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function s_(n){const e={};return n.replace(r_,t=>t.startsWith("/*")?"":t).split(n_).forEach(t=>{if(t){const i=t.split(i_);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function Ci(n){let e="";if(nn(n))e=n;else if(at(n))for(let t=0;t<n.length;t++){const i=Ci(n[t]);i&&(e+=i+" ")}else if(zt(n))for(const t in n)n[t]&&(e+=t+" ");return e.trim()}const o_="itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly",a_=zu(o_);function up(n){return!!n||n===""}function l_(n,e,t){if(n.length!==e.length)return!1;let i=!0;for(let r=0;i&&r<n.length;r++)i=Ks(n[r],e[r],t);return i}function Vh(n,e,t){if(n.size!==e.size)return!1;const i=Array.from(e),r=new Uint8Array(i.length);for(const s of n){let o=-1;for(let a=0;a<i.length;a++)if(!r[a]&&Ks(s,i[a],t)){o=a;break}if(o<0)return!1;r[o]=1}return!0}function c_(n,e,t){let i=yr(n),r=yr(e);if(i||r||(i=Fs(n),r=Fs(e),i||r))return i&&r?Vh(n,e,t):!1;const s=Object.keys(n).length,o=Object.keys(e).length;if(s!==o)return!1;for(const a in n){const l=Ct(n,a),c=Ct(e,a);if(l&&!c||!l&&c||!Ks(n[a],e[a],t))return!1}return zh(n)===zh(e)}function kh(n,e,t,i){t||(t=[new Map,new Map]);const[r,s]=t;if(r.has(n)||s.has(e))return r.get(n)===e&&s.get(e)===n;r.set(n,e),s.set(e,n);const o=i(n,e,t);return r.delete(n),s.delete(e),o}function Ks(n,e,t){if(n===e)return!0;let i=Oh(n),r=Oh(e);return i||r?i&&r?n.getTime()===e.getTime():!1:(i=Ri(n),r=Ri(e),i||r?n===e:(i=at(n),r=at(e),i||r?i&&r?kh(n,e,t,l_):!1:(i=zt(n),r=zt(e),i||r?!i||!r?!1:kh(n,e,t,c_):String(n)===String(e))))}function hp(n,e){return n.findIndex(t=>Ks(t,e))}function zh(n){return Object.getPrototypeOf(n)===null&&n[Symbol.toPrimitive]==null&&typeof n.toString!="function"&&typeof n.valueOf!="function"?Ys(n):String(n)}const fp=n=>!!(n&&n.__v_isRef===!0),Dt=n=>nn(n)?n:n==null?"":at(n)||zt(n)&&(n.toString===op||!pt(n.toString))?fp(n)?Dt(n.value):JSON.stringify(n,dp,2):String(n),dp=(n,e)=>fp(e)?dp(n,e.value):yr(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((t,[i,r],s)=>(t[kl(i,s)+" =>"]=r,t),{})}:Fs(e)?{[`Set(${e.size})`]:[...e.values()].map(t=>kl(t))}:Ri(e)?kl(e):zt(e)&&!at(e)&&!ap(e)?String(e):e,kl=(n,e="")=>{var t;return Ri(n)?`Symbol(${(t=n.description)!=null?t:e})`:n};/**
* @vue/reactivity v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let vn;class u_{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&vn&&(vn.active?(this.parent=vn,this.index=(vn.scopes||(vn.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){const i=this.scopes.slice();for(e=0,t=i.length;e<t;e++)i[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){const r=this.scopes.slice();for(e=0,t=r.length;e<t;e++)r[e].resume()}const i=this.effects.slice();for(e=0,t=i.length;e<t;e++)i[e].resume()}}run(e){if(this._active){const t=vn;try{return vn=this,e()}finally{vn=t}}}on(){++this._on===1&&(this.prevScope=vn,vn=this)}off(){if(this._on>0&&--this._on===0){if(vn===this)vn=this.prevScope;else{let e=vn;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,i;for(t=0,i=this.effects.length;t<i;t++)this.effects[t].stop();for(this.effects.length=0,t=0,i=this.cleanups.length;t<i;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){const r=this.scopes.slice();for(t=0,i=r.length;t<i;t++)r[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function h_(){return vn}let jt;const zl=new WeakSet;class pp{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,vn&&(vn.active?vn.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,zl.has(this)&&(zl.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||gp(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Hh(this),_p(this);const e=jt,t=ui;jt=this,ui=!0;try{return this.fn()}finally{vp(this),jt=e,ui=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)$u(e);this.deps=this.depsTail=void 0,Hh(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?zl.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Bc(this)&&this.run()}get dirty(){return Bc(this)}}let mp=0,Mo,So;function gp(n,e=!1){if(n.flags|=8,e){n.next=So,So=n;return}n.next=Mo,Mo=n}function Xu(){mp++}function ju(){if(--mp>0)return;if(So){let e=So;for(So=void 0;e;){const t=e.next;e.next=void 0,e.flags&=-9,e=t}}let n;for(;Mo;){let e=Mo;for(Mo=void 0;e;){const t=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){n||(n=i)}e=t}}if(n)throw n}function _p(n){for(let e=n.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function vp(n){let e,t=n.depsTail,i=t;for(;i;){const r=i.prevDep;i.version===-1?(i===t&&(t=r),$u(i),f_(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}n.deps=e,n.depsTail=t}function Bc(n){for(let e=n.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(xp(e.dep.computed)||e.dep.version!==e.version))return!0;return!!n._dirty}function xp(n){if(n.flags&4&&!(n.flags&16)||(n.flags&=-17,n.globalVersion===Io)||(n.globalVersion=Io,!n.isSSR&&n.flags&128&&(!n.deps&&!n._dirty||!Bc(n))))return;n.flags|=2;const e=n.dep,t=jt,i=ui;jt=n,ui=!0;try{_p(n);const r=n.fn(n._value);(e.version===0||Ei(r,n._value))&&(n.flags|=128,n._value=r,e.version++)}catch(r){throw e.version++,r}finally{jt=t,ui=i,vp(n),n.flags&=-3}}function $u(n,e=!1){const{dep:t,prevSub:i,nextSub:r}=n;if(i&&(i.nextSub=r,n.prevSub=void 0),r&&(r.prevSub=i,n.nextSub=void 0),t.subs===n&&(t.subs=i,!i&&t.computed)){t.computed.flags&=-5;for(let s=t.computed.deps;s;s=s.nextDep)$u(s,!0)}!e&&!--t.sc&&t.map&&t.map.delete(t.key)}function f_(n){const{prevDep:e,nextDep:t}=n;e&&(e.nextDep=t,n.prevDep=void 0),t&&(t.prevDep=e,n.nextDep=void 0)}let ui=!0;const yp=[];function Pi(){yp.push(ui),ui=!1}function Li(){const n=yp.pop();ui=n===void 0?!0:n}function Hh(n){const{cleanup:e}=n;if(n.cleanup=void 0,e){const t=jt;jt=void 0;try{e()}finally{jt=t}}}let Io=0;class d_{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class qu{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!jt||!ui||jt===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==jt)t=this.activeLink=new d_(jt,this),jt.deps?(t.prevDep=jt.depsTail,jt.depsTail.nextDep=t,jt.depsTail=t):jt.deps=jt.depsTail=t,Mp(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const i=t.nextDep;i.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=i),t.prevDep=jt.depsTail,t.nextDep=void 0,jt.depsTail.nextDep=t,jt.depsTail=t,jt.deps===t&&(jt.deps=i)}return t}trigger(e){this.version++,Io++,this.notify(e)}notify(e){Xu();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{ju()}}}function Mp(n){if(n.dep.sc++,n.sub.flags&4){const e=n.dep.computed;if(e&&!n.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)Mp(i)}const t=n.dep.subs;t!==n&&(n.prevSub=t,t&&(t.nextSub=n)),n.dep.subs=n}}const Vc=new WeakMap,Yr=Symbol(""),kc=Symbol(""),Do=Symbol("");function Sn(n,e,t){if(ui&&jt){let i=Vc.get(n);i||Vc.set(n,i=new Map);let r=i.get(t);r||(i.set(t,r=new qu),r.map=i,r.key=t),r.track()}}function Qi(n,e,t,i,r,s){const o=Vc.get(n);if(!o){Io++;return}const a=l=>{l&&l.trigger()};if(Xu(),e==="clear")o.forEach(a);else{const l=at(n),c=l&&Gu(t);if(l&&t==="length"){const u=Number(i);o.forEach((h,f)=>{(f==="length"||f===Do||!Ri(f)&&f>=u)&&a(h)})}else switch((t!==void 0||o.has(void 0))&&a(o.get(t)),c&&a(o.get(Do)),e){case"add":l?c&&a(o.get("length")):(a(o.get(Yr)),yr(n)&&a(o.get(kc)));break;case"delete":l||(a(o.get(Yr)),yr(n)&&a(o.get(kc)));break;case"set":yr(n)&&a(o.get(Yr));break}}ju()}function cs(n){const e=Ft(n);return e===n||(Sn(e,"iterate",Do),Jn(n))?e:Ii(n)?Mr(n)?e.map(t=>Er(Qn(t))):e.map(Er):e.map(Qn)}function _l(n){return Sn(n=Ft(n),"iterate",Do),n}function xi(n,e){return Ii(n)?Er(Mr(n)?Qn(e):e):Qn(e)}const p_={__proto__:null,[Symbol.iterator](){return Hl(this,Symbol.iterator,n=>xi(this,n))},concat(...n){return cs(this).concat(...n.map(e=>at(e)?cs(e):e))},entries(){return Hl(this,"entries",n=>(n[1]=xi(this,n[1]),n))},every(n,e){return Hi(this,"every",n,e,void 0,arguments)},filter(n,e){return Hi(this,"filter",n,e,t=>t.map(i=>xi(this,i)),arguments)},find(n,e){return Hi(this,"find",n,e,t=>xi(this,t),arguments)},findIndex(n,e){return Hi(this,"findIndex",n,e,void 0,arguments)},findLast(n,e){return Hi(this,"findLast",n,e,t=>xi(this,t),arguments)},findLastIndex(n,e){return Hi(this,"findLastIndex",n,e,void 0,arguments)},forEach(n,e){return Hi(this,"forEach",n,e,void 0,arguments)},includes(...n){return Gl(this,"includes",n)},indexOf(...n){return Gl(this,"indexOf",n)},join(n){return cs(this).join(n)},lastIndexOf(...n){return Gl(this,"lastIndexOf",n)},map(n,e){return Hi(this,"map",n,e,void 0,arguments)},pop(){return ro(this,"pop")},push(...n){return ro(this,"push",n)},reduce(n,...e){return Wh(this,"reduce",n,e)},reduceRight(n,...e){return Wh(this,"reduceRight",n,e)},shift(){return ro(this,"shift")},some(n,e){return Hi(this,"some",n,e,void 0,arguments)},splice(...n){return ro(this,"splice",n)},toReversed(){return cs(this).toReversed()},toSorted(n){return cs(this).toSorted(n)},toSpliced(...n){return cs(this).toSpliced(...n)},unshift(...n){return ro(this,"unshift",n)},values(){return Hl(this,"values",n=>xi(this,n))}};function Hl(n,e,t){const i=_l(n),r=i[e],s=r.call(i);if(i!==n&&!Jn(n)){if(s[Symbol.toStringTag]==="Array Iterator"){const o=Object.create(Object.getPrototypeOf(s));return o.next=()=>Gh(s.next(),t),r!==Sp[e]&&Object.defineProperties(o,{return:{get(){const a=s.return;return typeof a=="function"?a.bind(s):a}},throw:{get(){const a=s.throw;return typeof a=="function"?a.bind(s):a}}}),o}s._next=s.next,s.next=()=>Gh(s._next(),t)}return s}function Gh(n,e){return n.done||(n.value=e(n.value)),n}const Sp=Array.prototype;function Hi(n,e,t,i,r,s){const o=_l(n),a=o!==n&&!Jn(n),l=o[e];if(l!==Sp[e]){const h=l.apply(n,s);return a?Qn(h):h}let c=t;o!==n&&(a?c=function(h,f){return t.call(this,xi(n,h),f,n)}:t.length>2&&(c=function(h,f){return t.call(this,h,f,n)}));const u=l.call(o,c,i);return a&&r?r(u):u}function Wh(n,e,t,i){const r=_l(n),s=r!==n&&!Jn(n);let o=t,a=!1;r!==n&&(s?(a=i.length===0,o=function(c,u,h){return a&&(a=!1,c=xi(n,c)),t.call(this,c,xi(n,u),h,n)}):t.length>3&&(o=function(c,u,h){return t.call(this,c,u,h,n)}));const l=r[e](o,...i);return a?xi(n,l):l}function Gl(n,e,t){const i=Ft(n);Sn(i,"iterate",Do);const r=i[e](...t);return(r===-1||r===!1)&&Zu(t[0])?(t[0]=Ft(t[0]),i[e](...t)):r}function ro(n,e,t=[]){Pi(),Xu();const i=Ft(n)[e].apply(n,t);return ju(),Li(),i}const m_=zu("__proto__,__v_isRef,__isVue"),bp=new Set(Object.getOwnPropertyNames(Symbol).filter(n=>n!=="arguments"&&n!=="caller").map(n=>Symbol[n]).filter(Ri));function g_(n){Ri(n)||(n=String(n));const e=Ft(this);return Sn(e,"has",n),e.hasOwnProperty(n)}class Ep{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,i){if(t==="__v_skip")return e.__v_skip;const r=this._isReadonly,s=this._isShallow;if(t==="__v_isReactive")return!r;if(t==="__v_isReadonly")return r;if(t==="__v_isShallow")return s;if(t==="__v_raw")return i===(r?s?A_:Rp:s?wp:Ap).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=at(e);if(!r){let l;if(o&&(l=p_[t]))return l;if(t==="hasOwnProperty")return g_}const a=Reflect.get(e,t,bn(e)?e:i);if((Ri(t)?bp.has(t):m_(t))||(r||Sn(e,"get",t),s))return a;if(bn(a)){const l=o&&Gu(t)?a:a.value;return r&&zt(l)?Hc(l):l}return zt(a)?r?Hc(a):vl(a):a}}class Tp extends Ep{constructor(e=!1){super(!1,e)}set(e,t,i,r){let s=e[t];const o=at(e)&&Gu(t);if(!this._isShallow){const c=Ii(s);if(!Jn(i)&&!Ii(i)&&(s=Ft(s),i=Ft(i)),!o&&bn(s)&&!bn(i))return c||(s.value=i),!0}const a=o?Number(t)<e.length:Ct(e,t),l=Reflect.set(e,t,i,bn(e)?e:r);return e===Ft(r)&&l&&(a?Ei(i,s)&&Qi(e,"set",t,i):Qi(e,"add",t,i)),l}deleteProperty(e,t){const i=Ct(e,t);e[t];const r=Reflect.deleteProperty(e,t);return r&&i&&Qi(e,"delete",t,void 0),r}has(e,t){const i=Reflect.has(e,t);return(!Ri(t)||!bp.has(t))&&Sn(e,"has",t),i}ownKeys(e){return Sn(e,"iterate",at(e)?"length":Yr),Reflect.ownKeys(e)}}class __ extends Ep{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}}const v_=new Tp,x_=new __,y_=new Tp(!0);const zc=n=>n,oa=n=>Reflect.getPrototypeOf(n);function M_(n,e,t){return function(...i){const r=this.__v_raw,s=Ft(r),o=yr(s),a=n==="entries"||n===Symbol.iterator&&o,l=n==="keys"&&o,c=r[n](...i),u=t?zc:e?Er:Qn;return!e&&Sn(s,"iterate",l?kc:Yr),un(Object.create(c),{next(){const{value:h,done:f}=c.next();return f?{value:h,done:f}:{value:a?[u(h[0]),u(h[1])]:u(h),done:f}}})}}function aa(n){return function(...e){return n==="delete"?!1:n==="clear"?void 0:this}}function S_(n,e){const t={get(r){const s=this.__v_raw,o=Ft(s),a=Ft(r);n||(Ei(r,a)&&Sn(o,"get",r),Sn(o,"get",a));const{has:l}=oa(o),c=e?zc:n?Er:Qn;if(l.call(o,r))return c(s.get(r));if(l.call(o,a))return c(s.get(a));s!==o&&s.get(r)},get size(){const r=this.__v_raw;return!n&&Sn(Ft(r),"iterate",Yr),r.size},has(r){const s=this.__v_raw,o=Ft(s),a=Ft(r);return n||(Ei(r,a)&&Sn(o,"has",r),Sn(o,"has",a)),r===a?s.has(r):s.has(r)||s.has(a)},forEach(r,s){const o=this,a=o.__v_raw,l=Ft(a),c=e?zc:n?Er:Qn;return!n&&Sn(l,"iterate",Yr),a.forEach((u,h)=>r.call(s,c(u),c(h),o))}};return un(t,n?{add:aa("add"),set:aa("set"),delete:aa("delete"),clear:aa("clear")}:{add(r){const s=Ft(this),o=oa(s),a=Ft(r),l=!e&&!Jn(r)&&!Ii(r)?a:r;return o.has.call(s,l)||Ei(r,l)&&o.has.call(s,r)||Ei(a,l)&&o.has.call(s,a)||(s.add(l),Qi(s,"add",l,l)),this},set(r,s){!e&&!Jn(s)&&!Ii(s)&&(s=Ft(s));const o=Ft(this),{has:a,get:l}=oa(o);let c=a.call(o,r);c||(r=Ft(r),c=a.call(o,r));const u=l.call(o,r);return o.set(r,s),c?Ei(s,u)&&Qi(o,"set",r,s):Qi(o,"add",r,s),this},delete(r){const s=Ft(this),{has:o,get:a}=oa(s);let l=o.call(s,r);l||(r=Ft(r),l=o.call(s,r)),a&&a.call(s,r);const c=s.delete(r);return l&&Qi(s,"delete",r,void 0),c},clear(){const r=Ft(this),s=r.size!==0,o=r.clear();return s&&Qi(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{t[r]=M_(r,n,e)}),t}function Yu(n,e){const t=S_(n,e);return(i,r,s)=>r==="__v_isReactive"?!n:r==="__v_isReadonly"?n:r==="__v_isShallow"?e:r==="__v_raw"?i:Reflect.get(Ct(t,r)&&r in i?t:i,r,s)}const b_={get:Yu(!1,!1)},E_={get:Yu(!1,!0)},T_={get:Yu(!0,!1)};const Ap=new WeakMap,wp=new WeakMap,Rp=new WeakMap,A_=new WeakMap;function w_(n){switch(n){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function vl(n){return Ii(n)?n:Ku(n,!1,v_,b_,Ap)}function R_(n){return Ku(n,!1,y_,E_,wp)}function Hc(n){return Ku(n,!0,x_,T_,Rp)}function Ku(n,e,t,i,r){if(!zt(n)||n.__v_raw&&!(e&&n.__v_isReactive)||n.__v_skip||!Object.isExtensible(n))return n;const s=r.get(n);if(s)return s;const o=w_(Jg(n));if(o===0)return n;const a=new Proxy(n,o===2?i:t);return r.set(n,a),a}function Mr(n){return Ii(n)?Mr(n.__v_raw):!!(n&&n.__v_isReactive)}function Ii(n){return!!(n&&n.__v_isReadonly)}function Jn(n){return!!(n&&n.__v_isShallow)}function Zu(n){return n?!!n.__v_raw:!1}function Ft(n){const e=n&&n.__v_raw;return e?Ft(e):n}function C_(n){return!Ct(n,"__v_skip")&&Object.isExtensible(n)&&cp(n,"__v_skip",!0),n}const Qn=n=>zt(n)?vl(n):n,Er=n=>zt(n)?Hc(n):n;function bn(n){return n?n.__v_isRef===!0:!1}function Qa(n){return P_(n,!1)}function P_(n,e){return bn(n)?n:new L_(n,e)}class L_{constructor(e,t){this.dep=new qu,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:Ft(e),this._value=t?e:Qn(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){const t=this._rawValue,i=this.__v_isShallow||Jn(e)||Ii(e);e=i?e:Ft(e),Ei(e,t)&&(this._rawValue=e,this._value=i?e:Qn(e),this.dep.trigger())}}function Xe(n){return bn(n)?n.value:n}const I_={get:(n,e,t)=>e==="__v_raw"?n:Xe(Reflect.get(n,e,t)),set:(n,e,t,i)=>{const r=n[e];return bn(r)&&!bn(t)?(r.value=t,!0):Reflect.set(n,e,t,i)}};function Cp(n){return Mr(n)?n:new Proxy(n,I_)}class D_{constructor(e,t,i){this.fn=e,this.setter=t,this._value=void 0,this.dep=new qu(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Io-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&jt!==this)return gp(this,!0),!0}get value(){const e=this.dep.track();return xp(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function U_(n,e,t=!1){let i,r;return pt(n)?i=n:(i=n.get,r=n.set),new D_(i,r,t)}const la={},el=new WeakMap;let Hr;function N_(n,e=!1,t=Hr){if(t){let i=el.get(t);i||el.set(t,i=[]),i.push(n)}}function F_(n,e,t=Gt){const{immediate:i,deep:r,once:s,scheduler:o,augmentJob:a,call:l}=t,c=M=>r?M:Jn(M)||r===!1||r===0?er(M,1):er(M);let u,h,f,d,v=!1,x=!1;if(bn(n)?(h=()=>n.value,v=Jn(n)):Mr(n)?(h=()=>c(n),v=!0):at(n)?(x=!0,v=n.some(M=>Mr(M)||Jn(M)),h=()=>n.map(M=>{if(bn(M))return M.value;if(Mr(M))return c(M);if(pt(M))return l?l(M,2):M()})):pt(n)?e?h=l?()=>l(n,2):n:h=()=>{if(f){Pi();try{f()}finally{Li()}}const M=Hr;Hr=u;try{return l?l(n,3,[d]):n(d)}finally{Hr=M}}:h=wi,e&&r){const M=h,F=r===!0?1/0:r;h=()=>er(M(),F)}const _=h_(),p=()=>{u.stop(),_&&_.active&&Hu(_.effects,u)};if(s&&e){const M=e;e=(...F)=>{try{return M(...F)}finally{p()}}}let A=x?new Array(n.length).fill(la):la;const R=M=>{if(!(!(u.flags&1)||!u.dirty&&!M))if(e){const F=u.run();if(M||r||v||(x?F.some((I,U)=>Ei(I,A[U])):Ei(F,A))){const I=Hr;Pi();try{f&&f(),Hr=u;const U=[F,A===la?void 0:x&&A[0]===la?[]:A,d];A=F,l?l(e,3,U):e(...U)}finally{Hr=I,Li()}}}else u.run()};return a&&a(R),u=new pp(h),u.scheduler=o?()=>o(R,!1):R,d=M=>N_(M,!1,u),f=u.onStop=()=>{const M=el.get(u);if(M){if(l)l(M,4);else for(const F of M)F();el.delete(u)}},e?i?R(!0):A=u.run():o?o(R.bind(null,!0),!0):u.run(),p.pause=u.pause.bind(u),p.resume=u.resume.bind(u),p.stop=p,p}function er(n,e=1/0,t){if(e<=0||!zt(n)||n.__v_skip||(t=t||new Map,(t.get(n)||0)>=e))return n;if(t.set(n,e),e--,bn(n))er(n.value,e,t);else if(at(n))for(let i=0;i<n.length;i++)er(n[i],e,t);else if(Fs(n)||yr(n))n.forEach(i=>{er(i,e,t)});else if(ap(n)){for(const i in n)er(n[i],e,t);for(const i of Object.getOwnPropertySymbols(n))Object.prototype.propertyIsEnumerable.call(n,i)&&er(n[i],e,t)}return n}/**
* @vue/runtime-core v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function jo(n,e,t,i){try{return i?n(...i):n()}catch(r){xl(r,e,t)}}function fi(n,e,t,i){if(pt(n)){const r=jo(n,e,t,i);return r&&sp(r)&&r.catch(s=>{xl(s,e,t,void 0,!0)}),r}if(at(n)){const r=[];for(let s=0;s<n.length;s++)r.push(fi(n[s],e,t,i));return r}}function xl(n,e,t,i=!0,r=!1){const s=e?e.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:a}=e&&e.appContext.config||Gt;if(e){let l=e.parent;const c=e.proxy,u=`https://vuejs.org/error-reference/#runtime-${t}`;for(;l;){const h=l.ec;if(h&&!l.isUnmounted&&(!r||l.scope.active)){for(let f=0;f<h.length;f++)if(h[f](n,c,u)===!1)return}l=l.parent}if(o){Pi(),jo(o,null,10,[n,c,u]),Li();return}}O_(n,t,s,i,a)}function O_(n,e,t,i=!0,r=!1){if(r)throw n;console.error(n)}const Pn=[];let ri=-1;const yi=[];let mr=null,Ts=0;const Pp=Promise.resolve();let tl=null;function B_(n){const e=tl||Pp;return n?e.then(this?n.bind(this):n):e}function V_(n){let e=ri+1,t=Pn.length;for(;e<t;){const i=e+t>>>1,r=Pn[i],s=Uo(r);s<n||s===n&&r.flags&2?e=i+1:t=i}return e}function Ju(n){if(!(n.flags&1)){const e=Uo(n),t=Pn[Pn.length-1];!t||!(n.flags&2)&&e>=Uo(t)?Pn.push(n):Pn.splice(V_(e),0,n),n.flags|=1,Lp()}}function Lp(){tl||(tl=Pp.then(Up))}function k_(n){if(!at(n))mr&&n.id===-1?mr.splice(Ts+1,0,n):n.flags&1||(yi.push(n),n.flags|=1);else for(let e=0;e<n.length;e++)yi.push(n[e]);Lp()}function Ip(n,e,t,i=ri+1){for(;i<Pn.length;i++){const r=Pn[i];if(r&&r.flags&2){if(n&&r.id!==n.uid||e!==void 0&&!(r.id>=e))continue;Pn.splice(i,1),i=n?i-1:ri,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Dp(n,e,t=0){if(yi.length){let i=yi,r=0;if(e){i=[];for(let o=0;o<yi.length;o++){const a=yi[o];(a.i!==void 0?!a.i||a.i.uid<t:e.has(a))?yi[r++]=a:i.push(a)}}const s=[...new Set(i)].sort((o,a)=>Uo(o)-Uo(a));if(yi.length=r,mr){for(let o=0;o<s.length;o++)mr.push(s[o]);return}for(mr=s,Ts=0;Ts<mr.length;Ts++){const o=mr[Ts];o.flags&4&&(o.flags&=-2),o.flags&8||o(),o.flags&=-2}mr=null,Ts=0}}let Wl=!1;function z_(n,e){if(Wl){n();return}const t=e===void 0?void 0:new Set(yi);n(),Wl=!0;try{Ip(void 0,e),Dp(void 0,t,e)}finally{Wl=!1}}const Uo=n=>n.id==null?n.flags&2?-1:1/0:n.id;function Up(n){try{for(ri=0;ri<Pn.length;ri++){const e=Pn[ri];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),jo(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;ri<Pn.length;ri++){const e=Pn[ri];e&&(e.flags&=-2)}ri=-1,Pn.length=0,Dp(),tl=null,(Pn.length||yi.length)&&Up()}}let Kn=null,Np=null;function nl(n){const e=Kn;return Kn=n,Np=n&&n.type.__scopeId||null,e}function H_(n,e=Kn,t){if(!e||n._n)return n;const i=(...r)=>{i._d&&tf(-1);const s=nl(e),o=Kr.length;let a;try{a=n(...r)}finally{for(let l=Kr.length;l>o;l--)om();nl(s),i._d&&tf(1)}return a};return i._n=!0,i._c=!0,i._d=!0,i}function si(n,e){if(Kn===null)return n;const t=bl(Kn),i=n.dirs||(n.dirs=[]);for(let r=0;r<e.length;r++){let[s,o,a,l=Gt]=e[r];s&&(pt(s)&&(s={mounted:s,updated:s}),s.deep&&er(o),i.push({dir:s,instance:t,value:o,oldValue:void 0,arg:a,modifiers:l}))}return n}function Dr(n,e,t,i){let r=n;if(i==="beforeMount")n._mount=n;else if(i==="beforeUpdate"){const a=e&&e._mount;a&&(a._latest=n,n._mount=a)}else if(i==="mounted"){const a=n._latest;n._mount=n._latest=void 0,a&&(r=a,a._mount=void 0)}const s=r.dirs,o=e&&e.dirs;for(let a=0;a<s.length;a++){let l=s[a];o?l.oldValue=o[a].value:i==="mounted"&&l.oldValue!==void 0&&(l=un({},l,{oldValue:void 0}));let c=l.dir[i];c&&(Pi(),fi(c,t,8,[n.el,l,r,e]),Li())}}function G_(n,e){if(Dn){let t=Dn.provides;const i=Dn.parent&&Dn.parent.provides;i===t&&(t=Dn.provides=Object.create(i)),t[n]=e}}function za(n,e,t=!1){const i=z0();if(i||Ps){let r=Ps?Ps._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&n in r)return r[n];if(arguments.length>1)return t&&pt(e)?e.call(i&&i.proxy):e}}const W_=Symbol.for("v-scx"),X_=()=>za(W_);function _r(n,e,t){return Fp(n,e,t)}function Fp(n,e,t=Gt){const{immediate:i,deep:r,flush:s,once:o}=t,a=un({},t),l=e&&i||!e&&s!=="post";let c;if(Vo){if(s==="sync"){const d=X_();c=d.__watcherHandles||(d.__watcherHandles=[])}else if(!l){const d=()=>{};return d.stop=wi,d.resume=wi,d.pause=wi,d}}const u=Dn;a.call=(d,v,x)=>fi(d,u,v,x);let h=!1;s==="post"?a.scheduler=d=>{d.i=u,Rn(d,u&&u.suspense)}:s!=="sync"&&(h=!0,a.scheduler=(d,v)=>{v?d():Ju(d)}),a.augmentJob=d=>{e&&(d.flags|=4),h&&(d.flags|=2,u&&(d.id=u.uid,d.i=u))};const f=F_(n,e,a);return Vo&&(c?c.push(f):l&&f()),f}function j_(n,e,t){const i=this.proxy,r=nn(n)?n.includes(".")?Op(i,n):()=>i[n]:n.bind(i,i);let s;pt(e)?s=e:(s=e.handler,t=e);const o=$o(this),a=Fp(r,s.bind(i),t);return o(),a}function Op(n,e){const t=e.split(".");return()=>{let i=n;for(let r=0;r<t.length&&i;r++)i=i[t[r]];return i}}const $_=Symbol("_vte"),yl=n=>n.__isTeleport,Xl=Symbol("_leaveCb");function q_(n){let e=n[0];if(n.length>1){for(const t of n)if(t.type!==di){e=t;break}}return e}function Bp(n){if(!Qu(n))return yl(n.type)&&n.children?q_(n.children):n;if(n.component)return n.component.subTree;const{shapeFlag:e,children:t}=n;if(t){if(e&16)return t[0];if(e&32&&pt(t.default))return t.default()}}function bo(n,e){if(n.shapeFlag&6&&n.component){n.transition=e;const t=n.component.subTree;bo(yl(t.type)&&Bp(t)||t,e)}else if(n.shapeFlag&128){const t=n.suspense;if(t){const i=t.isHydrating?t.pendingBranch:t.activeBranch;i&&bo(i,e.clone(i))}else n.ssContent.transition=e.clone(n.ssContent),n.ssFallback.transition=e.clone(n.ssFallback)}else if(n.transition=e,n.type===pn&&at(n.children)){const t=$p(n.children,!1);t&&bo(t,e)}}function Gc(n){if(n.component)return Gc(n.component.subTree);if(n.type===pn){const e=at(n.children)&&$p(n.children,!1);return e?Gc(e):void 0}if(n.type!==di)return n}function is(n,e){return pt(n)?un({name:n.name},e,{setup:n}):n}function Vp(n){n.ids=[n.ids[0]+n.ids[2]+++"-",0,0]}function Xh(n,e){let t;return!!((t=Object.getOwnPropertyDescriptor(n,e))&&!t.configurable)}const il=new WeakMap;function Eo(n,e,t,i,r=!1){if(at(n)){n.forEach((x,_)=>Eo(x,e&&(at(e)?e[_]:e),t,i,r));return}if(To(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&Eo(n,e,t,i.component.subTree);return}const s=i.shapeFlag&4?bl(i.component):i.el,o=r?null:s,{i:a,r:l}=n,c=e&&e.r,u=a.refs===Gt?a.refs={}:a.refs,h=a.setupState,f=Ft(h),d=h===Gt?rp:x=>Xh(u,x)?!1:Ct(f,x),v=(x,_)=>!(_&&Xh(u,_));if(c!=null&&c!==l){if(jh(e),nn(c))u[c]=null,d(c)&&(h[c]=null);else if(bn(c)){const x=e;v(c,x.k)&&(c.value=null),x.k&&(u[x.k]=null)}}if(pt(l))jo(l,a,12,[o,u]);else{const x=nn(l),_=bn(l);if(x||_){const p=()=>{if(n.f){const A=x?d(l)?h[l]:u[l]:v()||!n.k?l.value:u[n.k];if(r)at(A)&&Hu(A,s);else if(at(A))A.includes(s)||A.push(s);else if(x)u[l]=[s],d(l)&&(h[l]=u[l]);else{const R=[s];v(l,n.k)&&(l.value=R),n.k&&(u[n.k]=R)}}else x?(u[l]=o,d(l)&&(h[l]=o)):_&&(v(l,n.k)&&(l.value=o),n.k&&(u[n.k]=o))};if(o){const A=()=>{p(),il.delete(n)};A.id=-1,il.set(n,A),Rn(A,t)}else jh(n),p()}}}function jh(n){const e=il.get(n);e&&(e.flags|=8,il.delete(n))}gl().requestIdleCallback;gl().cancelIdleCallback;const To=n=>!!n.type.__asyncLoader,Qu=n=>n.type.__isKeepAlive;function Y_(n,e){kp(n,"a",e)}function K_(n,e){kp(n,"da",e)}function kp(n,e,t=Dn){const i=n.__wdc||(n.__wdc=()=>{let r=t;for(;r;){if(r.isDeactivated)return;r=r.parent}return n()});if(No(e,i,t),t){let r=t.parent;for(;r&&r.parent;)Qu(r.parent.vnode)&&Z_(i,e,t,r),r=r.parent}}function Z_(n,e,t,i){const r=No(e,n,i,!0),s=No("um",()=>Hu(i[e],r),t);s.flags=16}function No(n,e,t=Dn,i=!1){if(t){const r=t[n]||(t[n]=[]),s=e.__weh||(e.__weh=(...o)=>{Pi();const a=$o(t),l=fi(e,t,n,o);return a(),Li(),l});return i?r.unshift(s):r.push(s),s}}const sr=n=>(e,t=Dn)=>{(!Vo||n==="sp")&&No(n,(...i)=>e(...i),t)},J_=sr("bm"),zp=sr("m"),Q_=sr("bu"),e0=sr("u"),Hp=sr("bum"),t0=sr("um"),n0=sr("sp"),i0=sr("rtg"),r0=sr("rtc");function s0(n,e=Dn){No("ec",n,e)}const o0=Symbol.for("v-ndc");function Fo(n,e,t,i){let r;const s=t,o=at(n);if(o||nn(n)){const a=o&&Mr(n);let l=!1,c=!1;a&&(l=!Jn(n),c=Ii(n),n=_l(n)),r=new Array(n.length);for(let u=0,h=n.length;u<h;u++)r[u]=e(l?c?Er(Qn(n[u])):Qn(n[u]):n[u],u,void 0,s)}else if(typeof n=="number")if(!Number.isInteger(n)||n<0)r=[];else{r=new Array(n);for(let a=0;a<n;a++)r[a]=e(a+1,a,void 0,s)}else if(zt(n))if(n[Symbol.iterator])r=Array.from(n,(a,l)=>e(a,l,void 0,s));else{const a=Object.keys(n);r=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];r[l]=e(n[u],u,l,s)}}else r=[];return r}const Wc=n=>n?um(n)?bl(n):Wc(n.parent):null,Ao=un(Object.create(null),{$:n=>n,$el:n=>n.vnode.el,$data:n=>n.data,$props:n=>n.props,$attrs:n=>n.attrs,$slots:n=>n.slots,$refs:n=>n.refs,$parent:n=>Wc(n.parent),$root:n=>Wc(n.root),$host:n=>n.ce,$emit:n=>n.emit,$options:n=>Wp(n),$forceUpdate:n=>n.f||(n.f=()=>{Ju(n.update)}),$nextTick:n=>n.n||(n.n=B_.bind(n.proxy)),$watch:n=>j_.bind(n)}),jl=(n,e)=>n!==Gt&&!n.__isScriptSetup&&Ct(n,e),a0={get({_:n},e){if(e==="__v_skip")return!0;const{ctx:t,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=n;if(e[0]!=="$"){const f=o[e];if(f!==void 0)switch(f){case 1:return i[e];case 2:return r[e];case 4:return t[e];case 3:return s[e]}else{if(jl(i,e))return o[e]=1,i[e];if(r!==Gt&&Ct(r,e))return o[e]=2,r[e];if(Ct(s,e))return o[e]=3,s[e];if(t!==Gt&&Ct(t,e))return o[e]=4,t[e];Xc&&(o[e]=0)}}const c=Ao[e];let u,h;if(c)return e==="$attrs"&&Sn(n.attrs,"get",""),c(n);if((u=a.__cssModules)&&(u=u[e]))return u;if(t!==Gt&&Ct(t,e))return o[e]=4,t[e];if(h=l.config.globalProperties,Ct(h,e))return h[e]},set({_:n},e,t){const{data:i,setupState:r,ctx:s}=n;return jl(r,e)?(r[e]=t,!0):i!==Gt&&Ct(i,e)?(i[e]=t,!0):Ct(n.props,e)||e[0]==="$"&&e.slice(1)in n?!1:(s[e]=t,!0)},has({_:{data:n,setupState:e,accessCache:t,ctx:i,appContext:r,props:s,type:o}},a){let l;return!!(t[a]||n!==Gt&&a[0]!=="$"&&Ct(n,a)||jl(e,a)||Ct(s,a)||Ct(i,a)||Ct(Ao,a)||Ct(r.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(n,e,t){return t.get!=null?n._.accessCache[e]=0:Ct(t,"value")&&this.set(n,e,t.value,null),Reflect.defineProperty(n,e,t)}};function $h(n){return at(n)?n.reduce((e,t)=>(e[t]=null,e),{}):n}let Xc=!0;function l0(n){const e=Wp(n),t=n.proxy,i=n.ctx;Xc=!1,e.beforeCreate&&qh(e.beforeCreate,n,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:h,mounted:f,beforeUpdate:d,updated:v,activated:x,deactivated:_,beforeDestroy:p,beforeUnmount:A,destroyed:R,unmounted:M,render:F,renderTracked:I,renderTriggered:U,errorCaptured:W,serverPrefetch:w,expose:E,inheritAttrs:B,components:ue,directives:ne,filters:de}=e;if(c&&c0(c,i,null),o)for(const Q in o){const z=o[Q];pt(z)&&(i[Q]=z.bind(t))}if(r){const Q=r.call(t,t);zt(Q)&&(n.data=vl(Q))}if(Xc=!0,s)for(const Q in s){const z=s[Q],ge=pt(z)?z.bind(t,t):pt(z.get)?z.get.bind(t,t):wi,Ae=!pt(z)&&pt(z.set)?z.set.bind(t):wi,ke=Ro({get:ge,set:Ae});Object.defineProperty(i,Q,{enumerable:!0,configurable:!0,get:()=>ke.value,set:Ze=>ke.value=Ze})}if(a)for(const Q in a)Gp(a[Q],i,t,Q);if(l){const Q=pt(l)?l.call(t):l;Reflect.ownKeys(Q).forEach(z=>{G_(z,Q[z])})}u&&qh(u,n,"c");function H(Q,z){at(z)?z.forEach(ge=>Q(ge.bind(t))):z&&Q(z.bind(t))}if(H(J_,h),H(zp,f),H(Q_,d),H(e0,v),H(Y_,x),H(K_,_),H(s0,W),H(r0,I),H(i0,U),H(Hp,A),H(t0,M),H(n0,w),at(E))if(E.length){const Q=n.exposed||(n.exposed={});E.forEach(z=>{Object.defineProperty(Q,z,{get:()=>t[z],set:ge=>t[z]=ge,enumerable:!0})})}else n.exposed||(n.exposed={});F&&n.render===wi&&(n.render=F),B!=null&&(n.inheritAttrs=B),ue&&(n.components=ue),ne&&(n.directives=ne),w&&Vp(n)}function c0(n,e,t=wi){at(n)&&(n=jc(n));for(const i in n){const r=n[i];let s;zt(r)?"default"in r?s=za(r.from||i,r.default,!0):s=za(r.from||i):s=za(r),bn(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function qh(n,e,t){fi(at(n)?n.map(i=>i.bind(e.proxy)):n.bind(e.proxy),e,t)}function Gp(n,e,t,i){let r=i.includes(".")?Op(t,i):()=>t[i];if(nn(n)){const s=e[n];pt(s)&&_r(r,s)}else if(pt(n))_r(r,n.bind(t));else if(zt(n))if(at(n))n.forEach(s=>Gp(s,e,t,i));else{const s=pt(n.handler)?n.handler.bind(t):e[n.handler];pt(s)&&_r(r,s,n)}}function Wp(n){const e=n.type,{mixins:t,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=n.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!t&&!i?l=e:(l={},r.length&&r.forEach(c=>rl(l,c,o,!0)),rl(l,e,o)),zt(e)&&s.set(e,l),l}function rl(n,e,t,i=!1){const{mixins:r,extends:s}=e;s&&rl(n,s,t,!0),r&&r.forEach(o=>rl(n,o,t,!0));for(const o in e)if(!(i&&o==="expose")){const a=u0[o]||t&&t[o];n[o]=a?a(n[o],e[o]):e[o]}return n}const u0={data:Yh,props:Kh,emits:Kh,methods:go,computed:go,beforeCreate:wn,created:wn,beforeMount:wn,mounted:wn,beforeUpdate:wn,updated:wn,beforeDestroy:wn,beforeUnmount:wn,destroyed:wn,unmounted:wn,activated:wn,deactivated:wn,errorCaptured:wn,serverPrefetch:wn,components:go,directives:go,watch:f0,provide:Yh,inject:h0};function Yh(n,e){return e?n?function(){return un(pt(n)?n.call(this,this):n,pt(e)?e.call(this,this):e)}:e:n}function h0(n,e){return go(jc(n),jc(e))}function jc(n){if(at(n)){const e={};for(let t=0;t<n.length;t++)e[n[t]]=n[t];return e}return n}function wn(n,e){return n?[...new Set([].concat(n,e))]:e}function go(n,e){return n?un(Object.create(null),n,e):e}function Kh(n,e){return n?at(n)&&at(e)?[...new Set([...n,...e])]:un(Object.create(null),$h(n),$h(e??{})):e}function f0(n,e){if(!n)return e;if(!e)return n;const t=un(Object.create(null),n);for(const i in e)t[i]=wn(n[i],e[i]);return t}function Xp(){return{app:null,config:{isNativeTag:rp,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let d0=0;function p0(n,e){return function(i,r=null){pt(i)||(i=un({},i)),r!=null&&!zt(r)&&(r=null);const s=Xp(),o=new WeakSet,a=[];let l=!1;const c=s.app={_uid:d0++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:$0,get config(){return s.config},set config(u){},use(u,...h){return o.has(u)||(u&&pt(u.install)?(o.add(u),u.install(c,...h)):pt(u)&&(o.add(u),u(c,...h))),c},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),c},component(u,h){return h?(s.components[u]=h,c):s.components[u]},directive(u,h){return h?(s.directives[u]=h,c):s.directives[u]},mount(u,h,f){if(!l){const d=c._ceVNode||Ln(i,r);return d.appContext=s,f===!0?f="svg":f===!1&&(f=void 0),n(d,u,f),l=!0,c._container=u,u.__vue_app__=c,bl(d.component)}},onUnmount(u){a.push(u)},unmount(){l&&(fi(a,c._instance,16),n(null,c._container),delete c._container.__vue_app__)},provide(u,h){return s.provides[u]=h,c},runWithContext(u){const h=Ps;Ps=c;try{return u()}finally{Ps=h}}};return c}}let Ps=null;const m0=(n,e)=>e==="modelValue"||e==="model-value"?n.modelModifiers:n[`${e}Modifiers`]||n[`${ci(e)}Modifiers`]||n[`${ns(e)}Modifiers`];function g0(n,e,...t){if(n.isUnmounted)return;const i=n.vnode.props||Gt;let r=t;const s=e.startsWith("update:"),o=s&&m0(i,e.slice(7));o&&(o.trim&&(r=t.map(u=>nn(u)?u.trim():u)),o.number&&(r=r.map(Wu)));let a,l=i[a=Vl(e)]||i[a=Vl(ci(e))];!l&&s&&(l=i[a=Vl(ns(e))]),l&&fi(l,n,6,r);const c=i[a+"Once"];if(c){if(!n.emitted)n.emitted={};else if(n.emitted[a])return;n.emitted[a]=!0,fi(c,n,6,r)}}const _0=new WeakMap;function jp(n,e,t=!1){const i=t?_0:e.emitsCache,r=i.get(n);if(r!==void 0)return r;const s=n.emits;let o={},a=!1;if(!pt(n)){const l=c=>{const u=jp(c,e,!0);u&&(a=!0,un(o,u))};!t&&e.mixins.length&&e.mixins.forEach(l),n.extends&&l(n.extends),n.mixins&&n.mixins.forEach(l)}return!s&&!a?(zt(n)&&i.set(n,null),null):(at(s)?s.forEach(l=>o[l]=null):un(o,s),zt(n)&&i.set(n,o),o)}function Ml(n,e){return!n||!dl(e)?!1:(e=e.slice(2),e=e==="Once"?e:e.replace(/Once$/,""),Ct(n,e[0].toLowerCase()+e.slice(1))||Ct(n,ns(e))||Ct(n,e))}function Zh(n){const{type:e,vnode:t,proxy:i,withProxy:r,propsOptions:[s],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:h,data:f,setupState:d,ctx:v,inheritAttrs:x}=n,_=nl(n);let p,A;try{if(t.shapeFlag&4){const M=r||i,F=M;p=Mi(c.call(F,M,u,h,d,f,v)),A=a}else{const M=e;p=Mi(M.length>1?M(h,{attrs:a,slots:o,emit:l}):M(h,null)),A=e.props?a:v0(a)}}catch(M){Kr.length=0,xl(M,n,1),p=Ln(di)}let R=p;if(A&&x!==!1){const M=Object.keys(A),{shapeFlag:F}=R;M.length&&F&7&&(s&&M.some(pl)&&(A=x0(A,s)),R=Os(R,A,!1,!0))}if(t.dirs&&(R=Os(R,null,!1,!0),R.dirs=R.dirs?R.dirs.concat(t.dirs):t.dirs),t.transition){const M=yl(R.type)&&Bp(R)||R;bo(M,t.transition)}return p=R,nl(_),p}function $p(n,e=!0){let t;for(let i=0;i<n.length;i++){const r=n[i];if(nh(r)){if(r.type!==di||r.children==="v-if"){if(t)return;t=r}}else return}return t}const v0=n=>{let e;for(const t in n)(t==="class"||t==="style"||dl(t))&&((e||(e={}))[t]=n[t]);return e},x0=(n,e)=>{const t={};for(const i in n)(!pl(i)||!(i.slice(9)in e))&&(t[i]=n[i]);return t};function y0(n,e,t){const{props:i,children:r,component:s}=n,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return i?Jh(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let h=0;h<u.length;h++){const f=u[h];if(qp(o,i,f)&&!Ml(c,f))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?Jh(i,o,c):!0:!!o;return!1}function Jh(n,e,t){const i=Object.keys(e);if(i.length!==Object.keys(n).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(!Ct(n,s)||qp(e,n,s)&&!Ml(t,s))return!0}return!1}function qp(n,e,t){const i=n[t],r=e[t];return t==="style"&&zt(i)&&zt(r)?!Ks(i,r):i!==r}function M0({vnode:n,parent:e,suspense:t},i){for(;e;){const r=e.subTree;if(r.suspense&&r.suspense.activeBranch===n&&(r.suspense.vnode.el=r.el=i,n=r),r===n)(n=e.vnode).el=i,e=e.parent;else break}t&&t.activeBranch===n&&(t.vnode.el=i)}const Yp={},Kp=()=>Object.create(Yp),Zp=n=>Object.getPrototypeOf(n)===Yp;function S0(n,e,t,i=!1){const r={},s=Kp();n.propsDefaults=Object.create(null),Jp(n,e,r,s);for(const o in n.propsOptions[0])o in r||(r[o]=void 0);t?n.props=i?r:R_(r):n.type.props?n.props=r:n.props=s,n.attrs=s}function b0(n,e,t,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=n,a=Ft(r),[l]=n.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=n.vnode.dynamicProps;for(let h=0;h<u.length;h++){let f=u[h];if(Ml(n.emitsOptions,f))continue;const d=e[f];if(l)if(Ct(s,f))d!==s[f]&&(s[f]=d,c=!0);else{const v=ci(f);r[v]=$c(l,a,v,d,n,!1)}else d!==s[f]&&(s[f]=d,c=!0)}}}else{Jp(n,e,r,s)&&(c=!0);let u;for(const h in a)(!e||!Ct(e,h)&&((u=ns(h))===h||!Ct(e,u)))&&(l?t&&(t[h]!==void 0||t[u]!==void 0)&&(r[h]=$c(l,a,h,void 0,n,!0)):delete r[h]);if(s!==a)for(const h in s)(!e||!Ct(e,h))&&(delete s[h],c=!0)}c&&Qi(n.attrs,"set","")}function Jp(n,e,t,i){const[r,s]=n.propsOptions;let o=!1,a;if(e)for(let l in e){if(yo(l))continue;const c=e[l];let u;r&&Ct(r,u=ci(l))?!s||!s.includes(u)?t[u]=c:(a||(a={}))[u]=c:Ml(n.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=Ft(t),c=a||Gt;for(let u=0;u<s.length;u++){const h=s[u];t[h]=$c(r,l,h,c[h],n,!Ct(c,h))}}return o}function $c(n,e,t,i,r,s){const o=n[t];if(o!=null){const a=Ct(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&pt(l)){const{propsDefaults:c}=r;if(t in c)i=c[t];else{const u=$o(r);i=c[t]=l.call(null,e),u()}}else i=l;r.ce&&r.ce._setProp(t,i)}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===ns(t))&&(i=!0))}return i}const E0=new WeakMap;function Qp(n,e,t=!1){const i=t?E0:e.propsCache,r=i.get(n);if(r)return r;const s=n.props,o={},a=[];let l=!1;if(!pt(n)){const u=h=>{l=!0;const[f,d]=Qp(h,e,!0);un(o,f),d&&a.push(...d)};!t&&e.mixins.length&&e.mixins.forEach(u),n.extends&&u(n.extends),n.mixins&&n.mixins.forEach(u)}if(!s&&!l)return zt(n)&&i.set(n,$r),$r;if(at(s))for(let u=0;u<s.length;u++){const h=ci(s[u]);Qh(h)&&(o[h]=Gt)}else if(s)for(const u in s){const h=ci(u);if(Qh(h)){const f=s[u],d=o[h]=at(f)||pt(f)?{type:f}:un({},f),v=d.type;let x=!1,_=!0;if(at(v))for(let p=0;p<v.length;++p){const A=v[p],R=pt(A)&&A.name;if(R==="Boolean"){x=!0;break}else R==="String"&&(_=!1)}else x=pt(v)&&v.name==="Boolean";d[0]=x,d[1]=_,(x||Ct(d,"default"))&&a.push(h)}}const c=[o,a];return zt(n)&&i.set(n,c),c}function Qh(n){return n[0]!=="$"&&!yo(n)}const eh=n=>n==="_"||n==="_ctx"||n==="$stable",th=n=>at(n)?n.map(Mi):[Mi(n)],T0=(n,e,t)=>{if(e._n)return e;const i=H_((...r)=>th(e(...r)),t);return i._c=!1,i},em=(n,e,t)=>{const i=n._ctx;for(const r in n){if(eh(r))continue;const s=n[r];if(pt(s))e[r]=T0(r,s,i);else if(s!=null){const o=th(s);e[r]=()=>o}}},tm=(n,e)=>{const t=th(e);n.slots.default=()=>t},nm=(n,e,t)=>{for(const i in e)(t||!eh(i))&&(n[i]=e[i])},A0=(n,e,t)=>{const i=n.slots=Kp();if(n.vnode.shapeFlag&32){const r=e._;r?(nm(i,e,t),t&&cp(i,"_",r,!0)):em(e,i)}else e&&tm(n,e)},w0=(n,e,t)=>{const{vnode:i,slots:r}=n;let s=!0,o=Gt;if(i.shapeFlag&32){const a=e._;a?t&&a===1?s=!1:nm(r,e,t):(s=!e.$stable,em(e,r)),o=e}else e&&(tm(n,e),o={default:1});if(s)for(const a in r)!eh(a)&&o[a]==null&&delete r[a]},Rn=D0;function R0(n){return C0(n)}function C0(n,e){const t=gl();t.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:h,nextSibling:f,setScopeId:d=wi,insertStaticContent:v}=n,x=(L,N,K,C=null,pe=null,se=null,ve=void 0,oe=null,ye=!!N.dynamicChildren)=>{if(L===N)return;L&&!so(L,N)&&(C=De(L),Ze(L,pe,se,!0),L=null),N.patchFlag===-2&&(ye=!1,N.dynamicChildren=null),N.dynamicChildren&&L&&L.dynamicChildren&&L.dynamicChildren.hasOnce&&(N.dynamicChildren===$r&&(N.dynamicChildren=[]),N.dynamicChildren.hasOnce=!0);const{type:Z,ref:T,shapeFlag:y}=N;switch(Z){case Sl:_(L,N,K,C);break;case di:p(L,N,K,C);break;case ql:L==null&&A(N,K,C,ve);break;case pn:ue(L,N,K,C,pe,se,ve,oe,ye);break;default:y&1?F(L,N,K,C,pe,se,ve,oe,ye):y&6?ne(L,N,K,C,pe,se,ve,oe,ye):(y&64||y&128)&&Z.process(L,N,K,C,pe,se,ve,oe,ye,it)}T!=null&&pe?Eo(T,L&&L.ref,se,N||L,!N):T==null&&L&&L.ref!=null&&Eo(L.ref,null,se,L,!0)},_=(L,N,K,C)=>{if(L==null)i(N.el=a(N.children),K,C);else{const pe=N.el=L.el;N.children!==L.children&&c(pe,N.children)}},p=(L,N,K,C)=>{L==null?i(N.el=l(N.children||""),K,C):N.el=L.el},A=(L,N,K,C)=>{[L.el,L.anchor]=v(L.children,N,K,C,L.el,L.anchor)},R=({el:L,anchor:N},K,C)=>{let pe;for(;L&&L!==N;)pe=f(L),i(L,K,C),L=pe;i(N,K,C)},M=({el:L,anchor:N})=>{let K;for(;L&&L!==N;)K=f(L),r(L),L=K;r(N)},F=(L,N,K,C,pe,se,ve,oe,ye)=>{if(N.type==="svg"?ve="svg":N.type==="math"&&(ve="mathml"),L==null)I(N,K,C,pe,se,ve,oe,ye);else{const Z=L.el&&L.el._isVueCE?L.el:null;try{Z&&Z._beginPatch(),w(L,N,pe,se,ve,oe,ye)}finally{Z&&Z._endPatch()}}},I=(L,N,K,C,pe,se,ve,oe)=>{let ye,Z;const{props:T,shapeFlag:y,transition:V,dirs:J}=L;if(ye=L.el=o(L.type,se,T&&T.is,T),y&8?u(ye,L.children):y&16&&W(L.children,ye,null,C,pe,$l(L,se),ve,oe),J&&Dr(L,null,C,"created"),U(ye,L,L.scopeId,ve,C),T){for(const te in T)te!=="value"&&!yo(te)&&s(ye,te,null,T[te],se,C);"value"in T&&s(ye,"value",null,T.value,se),(Z=T.onVnodeBeforeMount)&&_i(Z,C,L)}J&&Dr(L,null,C,"beforeMount");const ae=P0(pe,V);ae?V.beforeEnter(ye):V&&!V.persisted&&(ye[I0]=!0),i(ye,N,K),((Z=T&&T.onVnodeMounted)||ae||J)&&Rn(()=>{try{Z&&_i(Z,C,L),ae&&V.enter(ye),J&&Dr(L,null,C,"mounted")}finally{}},pe)},U=(L,N,K,C,pe)=>{if(K&&d(L,K),C)for(let se=0;se<C.length;se++)d(L,C[se]);if(pe){let se=pe.subTree;if(N===se||sm(se.type)&&(se.ssContent===N||se.ssFallback===N)){const ve=pe.vnode;U(L,ve,ve.scopeId,ve.slotScopeIds,pe.parent)}}},W=(L,N,K,C,pe,se,ve,oe,ye=0)=>{for(let Z=ye;Z<L.length;Z++){const T=L[Z]=oe?Ji(L[Z]):Mi(L[Z]);x(null,T,N,K,C,pe,se,ve,oe)}},w=(L,N,K,C,pe,se,ve)=>{const oe=N.el=L.el;let{patchFlag:ye,dynamicChildren:Z,dirs:T}=N;ye|=L.patchFlag&16;const y=L.props||Gt,V=N.props||Gt;let J;if(K&&Ur(K,!1),(J=V.onVnodeBeforeUpdate)&&_i(J,K,N,L),T&&Dr(N,L,K,"beforeUpdate"),K&&Ur(K,!0),Z&&(!L.dynamicChildren||L.dynamicChildren.length!==Z.length)&&(ye=0,ve=!1,Z=null),(y.innerHTML&&V.innerHTML==null||y.textContent&&V.textContent==null)&&u(oe,""),Z?E(L.dynamicChildren,Z,oe,K,C,$l(N,pe),se):ve||z(L,N,oe,null,K,C,$l(N,pe),se,!1),ye>0){if(ye&16)B(oe,y,V,K,pe);else if(ye&2&&y.class!==V.class&&s(oe,"class",null,V.class,pe),ye&4&&s(oe,"style",y.style,V.style,pe),ye&8){const ae=N.dynamicProps;for(let te=0;te<ae.length;te++){const we=ae[te],Re=y[we],Te=V[we];(Te!==Re||we==="value")&&s(oe,we,Re,Te,pe,K)}}ye&1&&L.children!==N.children&&u(oe,N.children)}else!ve&&Z==null&&B(oe,y,V,K,pe);((J=V.onVnodeUpdated)||T)&&Rn(()=>{J&&_i(J,K,N,L),T&&Dr(N,L,K,"updated")},C)},E=(L,N,K,C,pe,se,ve)=>{for(let oe=0;oe<N.length;oe++){const ye=L[oe],Z=N[oe],T=ye.el||wo(ye),y=T&&(ye.type===pn||!so(ye,Z)||ye.shapeFlag&198)?h(T):K;x(ye,Z,y,null,C,pe,se,ve,!0)}},B=(L,N,K,C,pe)=>{if(N!==K){if(N!==Gt)for(const se in N)!yo(se)&&!(se in K)&&s(L,se,N[se],null,pe,C);for(const se in K){if(yo(se))continue;const ve=K[se],oe=N[se];ve!==oe&&se!=="value"&&s(L,se,oe,ve,pe,C)}"value"in K&&s(L,"value",N.value,K.value,pe)}},ue=(L,N,K,C,pe,se,ve,oe,ye)=>{const Z=N.el=L?L.el:a(""),T=N.anchor=L?L.anchor:a("");let{patchFlag:y,dynamicChildren:V,slotScopeIds:J}=N;J&&(oe=oe?oe.concat(J):J),L==null?(i(Z,K,C),i(T,K,C),W(N.children||[],K,T,pe,se,ve,oe,ye)):y>0&&y&64&&V&&L.dynamicChildren&&L.dynamicChildren.length===V.length?(E(L.dynamicChildren,V,K,pe,se,ve,oe),(N.key!=null||pe&&N===pe.subTree)&&im(L,N,!0)):z(L,N,K,T,pe,se,ve,oe,ye)},ne=(L,N,K,C,pe,se,ve,oe,ye)=>{N.slotScopeIds=oe,L==null?N.shapeFlag&512?pe.ctx.activate(N,K,C,ve,ye):de(N,K,C,pe,se,ve,ye):be(L,N,ye)},de=(L,N,K,C,pe,se,ve)=>{const oe=L.component=k0(L,C,pe);if(Qu(L)&&(oe.ctx.renderer=it),H0(oe,!1,ve),oe.asyncDep){if(pe&&pe.registerDep(oe,H,ve,se),!L.el){const ye=oe.subTree=Ln(di);p(null,ye,N,K),L.placeholder=ye.el}}else H(oe,L,N,K,pe,se,ve)},be=(L,N,K)=>{const C=N.component=L.component;if(y0(L,N,K))if(C.asyncDep&&!C.asyncResolved){N.el=L.el,N.placeholder=L.placeholder,Q(C,N,K);return}else C.next=N,C.update();else N.el=L.el,N.placeholder=L.placeholder,C.vnode=N},H=(L,N,K,C,pe,se,ve)=>{const oe=()=>{if(L.isMounted){let{next:y,bu:V,u:J,parent:ae,vnode:te}=L;{const he=rm(L);if(he){y&&(y.el=te.el,Q(L,y,ve)),he.asyncDep.then(()=>{const Ne=()=>{L.job.flags&8||(pe&&pe.pendingBranch?Rn(Ne,pe):Z())};Ne.flags=48,Rn(Ne,pe)});return}}let we=y,Re;Ur(L,!1),y?(y.el=te.el,Q(L,y,ve)):y=te,V&&ka(V),(Re=y.props&&y.props.onVnodeBeforeUpdate)&&_i(Re,ae,y,te),Ur(L,!0);const Te=Zh(L),rt=L.subTree;L.subTree=Te,x(rt,Te,h(rt.el||wo(rt)),De(rt),L,pe,se),y.el=Te.el,we===null&&M0(L,Te.el),J&&Rn(J,pe),(Re=y.props&&y.props.onVnodeUpdated)&&Rn(()=>_i(Re,ae,y,te),pe)}else{let y;const{el:V,props:J}=N,{bm:ae,m:te,parent:we,root:Re,type:Te}=L,rt=To(N);Ur(L,!1),ae&&ka(ae),!rt&&(y=J&&J.onVnodeBeforeMount)&&_i(y,we,N),Ur(L,!0);{Re.ce&&Re.ce._hasShadowRoot()&&Re.ce._injectChildStyle(Te,L.parent?L.parent.type:void 0);const he=L.subTree=Zh(L);x(null,he,K,C,L,pe,se),N.el=he.el}if(te&&Rn(te,pe),!rt&&(y=J&&J.onVnodeMounted)){const he=N;Rn(()=>_i(y,we,he),pe)}(N.shapeFlag&256||we&&To(we.vnode)&&we.vnode.shapeFlag&256)&&L.a&&Rn(L.a,pe),L.isMounted=!0,N=K=C=null}};L.scope.on();const ye=L.effect=new pp(oe);L.scope.off();const Z=L.update=ye.run.bind(ye),T=L.job=ye.runIfDirty.bind(ye);T.i=L,T.id=L.uid,ye.scheduler=()=>Ju(T),Ur(L,!0),Z()},Q=(L,N,K)=>{N.component=L;const C=L.vnode.props;L.vnode=N,L.next=null,b0(L,N.props,C,K),w0(L,N.children,K),Pi(),Ip(L),Li()},z=(L,N,K,C,pe,se,ve,oe,ye=!1)=>{const Z=L&&L.children,T=L?L.shapeFlag:0,y=N.children,{patchFlag:V,shapeFlag:J}=N;if(V>0){if(V&128){Ae(Z,y,K,C,pe,se,ve,oe,ye);return}else if(V&256){ge(Z,y,K,C,pe,se,ve,oe,ye);return}}J&8?(T&16&&je(Z,pe,se),y!==Z&&u(K,y)):T&16?J&16?Ae(Z,y,K,C,pe,se,ve,oe,ye):je(Z,pe,se,!0):(T&8&&u(K,""),J&16&&W(y,K,C,pe,se,ve,oe,ye))},ge=(L,N,K,C,pe,se,ve,oe,ye)=>{L=L||$r,N=N||$r;const Z=L.length,T=N.length,y=Math.min(Z,T);let V;for(V=0;V<y;V++){const J=N[V]=ye?Ji(N[V]):Mi(N[V]);x(L[V],J,K,null,pe,se,ve,oe,ye)}Z>T?je(L,pe,se,!0,!1,y):W(N,K,C,pe,se,ve,oe,ye,y)},Ae=(L,N,K,C,pe,se,ve,oe,ye)=>{let Z=0;const T=N.length;let y=L.length-1,V=T-1;for(;Z<=y&&Z<=V;){const J=L[Z],ae=N[Z]=ye?Ji(N[Z]):Mi(N[Z]);if(so(J,ae))x(J,ae,K,null,pe,se,ve,oe,ye);else break;Z++}for(;Z<=y&&Z<=V;){const J=L[y],ae=N[V]=ye?Ji(N[V]):Mi(N[V]);if(so(J,ae))x(J,ae,K,null,pe,se,ve,oe,ye);else break;y--,V--}if(Z>y){if(Z<=V){const J=V+1,ae=J<T?N[J].el:C;for(;Z<=V;)x(null,N[Z]=ye?Ji(N[Z]):Mi(N[Z]),K,ae,pe,se,ve,oe,ye),Z++}}else if(Z>V)for(;Z<=y;)Ze(L[Z],pe,se,!0),Z++;else{const J=Z,ae=Z,te=new Map;for(Z=ae;Z<=V;Z++){const Ke=N[Z]=ye?Ji(N[Z]):Mi(N[Z]);Ke.key!=null&&te.set(Ke.key,Z)}let we,Re=0;const Te=V-ae+1;let rt=!1,he=0;const Ne=new Array(Te);for(Z=0;Z<Te;Z++)Ne[Z]=0;for(Z=J;Z<=y;Z++){const Ke=L[Z];if(Re>=Te){Ze(Ke,pe,se,!0);continue}let Ue;if(Ke.key!=null)Ue=te.get(Ke.key);else for(we=ae;we<=V;we++)if(Ne[we-ae]===0&&so(Ke,N[we])){Ue=we;break}Ue===void 0?Ze(Ke,pe,se,!0):(Ne[Ue-ae]=Z+1,Ue>=he?he=Ue:rt=!0,x(Ke,N[Ue],K,null,pe,se,ve,oe,ye),Re++)}const We=rt?L0(Ne):$r;for(we=We.length-1,Z=Te-1;Z>=0;Z--){const Ke=ae+Z,Ue=N[Ke],xt=N[Ke+1],ft=Ke+1<T?xt.el||wo(xt):C;Ne[Z]===0?x(null,Ue,K,ft,pe,se,ve,oe,ye):rt&&(we<0||Z!==We[we]?ke(Ue,K,ft,2):we--)}}},ke=(L,N,K,C,pe=null)=>{const{el:se,type:ve,transition:oe,children:ye,shapeFlag:Z}=L;if(Z&6){ke(L.component.subTree,N,K,C);return}if(Z&128){L.suspense.move(N,K,C);return}if(Z&64){ve.move(L,N,K,it);return}if(ve===pn){i(se,N,K);for(let y=0;y<ye.length;y++)ke(ye[y],N,K,C);i(L.anchor,N,K);return}if(ve===ql){R(L,N,K);return}if(C!==2&&Z&1&&oe)if(C===0)oe.persisted&&!se[Xl]?i(se,N,K):(oe.beforeEnter(se),i(se,N,K),Rn(()=>oe.enter(se),pe));else{const{leave:y,delayLeave:V,afterLeave:J}=oe,ae=()=>{L.ctx.isUnmounted?r(se):i(se,N,K)},te=()=>{const we=se._isLeaving||!!se[Xl];se._isLeaving&&se[Xl](!0),oe.persisted&&!we?ae():y(se,()=>{ae(),J&&J()})};V?V(se,ae,te):te()}else i(se,N,K)},Ze=(L,N,K,C=!1,pe=!1)=>{const{type:se,props:ve,ref:oe,children:ye,dynamicChildren:Z,shapeFlag:T,patchFlag:y,dirs:V,cacheIndex:J,memo:ae}=L;if((y===-2||Z&&Z.hasOnce)&&(pe=!1),oe!=null&&(Pi(),Eo(oe,null,K,L,!0),Li()),J!=null&&(!L.ctx||L.ctx===N)&&(N.renderCache[J]=void 0),T&256&&N.ctx.deactivate(L))return;const te=T&1&&V,we=!To(L);let Re;if(we&&(Re=ve&&ve.onVnodeBeforeUnmount)&&_i(Re,N,L),T&6)Le(L.component,K,C);else{if(T&128){L.suspense.unmount(K,C);return}te&&Dr(L,null,N,"beforeUnmount"),T&64?L.type.remove(L,N,K,it,C):Z&&!Z.hasOnce&&(se!==pn||y>0&&y&64)?je(Z,N,K,!1,!0):(se===pn&&y&384||!pe&&T&16)&&je(ye,N,K),C&&Mt(L)}const Te=ae!=null&&J==null;(we&&(Re=ve&&ve.onVnodeUnmounted)||te||Te)&&Rn(()=>{Re&&_i(Re,N,L),te&&Dr(L,null,N,"unmounted"),Te&&(L.el=null)},K)},Mt=L=>{const{type:N,el:K,anchor:C,transition:pe}=L,se=N===pn;if(se&&!pe){_e(K,C);return}if(N===ql){M(L),pe&&!pe.persisted&&pe.afterLeave&&pe.afterLeave();return}const ve=se?Gc(L):L,oe=()=>{se?h(K)&&_e(K,C):r(K),pe&&!pe.persisted&&pe.afterLeave&&pe.afterLeave()};if(ve&&ve.shapeFlag&1&&pe&&!pe.persisted){const{leave:ye,delayLeave:Z}=pe,T=ve.el,y=()=>ye(T,oe);Z?Z(T,oe,y):y()}else oe()},_e=(L,N)=>{let K;for(;L!==N;)K=f(L),r(L),L=K;r(N)},Le=(L,N,K)=>{const{bum:C,scope:pe,job:se,subTree:ve,um:oe,m:ye,a:Z}=L;ef(ye),ef(Z),C&&ka(C),pe.stop(),se?(se.flags|=8,Ze(ve,L,N,K)):ve&&(ve.transition=L.vnode.transition,Ze(ve,L,N,K)),oe&&Rn(oe,N);const T=()=>{L.isUnmounted=!0};T.flags=16,Rn(T,N)},je=(L,N,K,C=!1,pe=!1,se=0)=>{for(let ve=se;ve<L.length;ve++)Ze(L[ve],N,K,C,pe)},De=L=>{if(L.shapeFlag&6)return De(L.component.subTree);if(L.shapeFlag&128)return L.suspense.next();const N=f(L.anchor||L.el),K=N&&N[$_];return K?f(K):N},nt=(L,N,K)=>{const C=L&&N._vnode?void 0:L&&L.component?L.component.uid:V0();z_(()=>{L==null?N._vnode&&Ze(N._vnode,null,null,!0):x(N._vnode||null,L,N,null,null,null,K),N._vnode=L},C)},it={p:x,um:Ze,m:ke,r:Mt,mt:de,mc:W,pc:z,pbc:E,n:De,o:n};return{render:nt,hydrate:void 0,createApp:p0(nt)}}function $l({type:n,props:e},t){return t==="svg"&&n==="foreignObject"||t==="mathml"&&n==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:t}function Ur({effect:n,job:e},t){t?(n.flags|=32,e.flags|=4):(n.flags&=-33,e.flags&=-5)}function P0(n,e){return(!n||n&&!n.pendingBranch)&&e&&!e.persisted}function im(n,e,t=!1){const i=n.children,r=e.children;if(at(i)&&at(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=Ji(r[s]),a.el=o.el),!t&&a.patchFlag!==-2&&im(o,a)),a.type===Sl&&(a.patchFlag===-1&&(a=r[s]=Ji(a)),a.el=o.el),a.type===di&&!a.el&&(a.el=o.el)}}function L0(n){const e=n.slice(),t=[0];let i,r,s,o,a;const l=n.length;for(i=0;i<l;i++){const c=n[i];if(c!==0){if(r=t[t.length-1],n[r]<c){e[i]=r,t.push(i);continue}for(s=0,o=t.length-1;s<o;)a=s+o>>1,n[t[a]]<c?s=a+1:o=a;c<n[t[s]]&&(s>0&&(e[i]=t[s-1]),t[s]=i)}}for(s=t.length,o=t[s-1];s-- >0;)t[s]=o,o=e[o];return t}function rm(n){const e=n.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:rm(e)}function ef(n){if(n)for(let e=0;e<n.length;e++)n[e].flags|=8}function wo(n){if(n.placeholder)return n.placeholder;const e=n.component;if(e)return wo(e.subTree);const t=n.suspense;return t&&t.activeBranch?wo(t.activeBranch):null}const sm=n=>n.__isSuspense,I0=Symbol("_deferredEnter");function D0(n,e){e&&e.pendingBranch?at(n)?e.effects.push(...n):e.effects.push(n):k_(n)}const pn=Symbol.for("v-fgt"),Sl=Symbol.for("v-txt"),di=Symbol.for("v-cmt"),ql=Symbol.for("v-stc"),Kr=[];let zn=null;function Kt(n=!1){Kr.push(zn=n?null:[])}function om(){Kr.pop(),zn=Kr[Kr.length-1]||null}let Oo=1;function tf(n,e=!1){Oo+=n,n<0&&zn&&e&&(zn.hasOnce=!0)}function am(n){return n.dynamicChildren=Oo>0?zn||$r:null,om(),Oo>0&&zn&&zn.push(n),n}function en(n,e,t,i,r,s){return am(Se(n,e,t,i,r,s,!0))}function U0(n,e,t,i,r){return am(Ln(n,e,t,i,r,!0))}function nh(n){return n?n.__v_isVNode===!0:!1}function so(n,e){return n.type===e.type&&n.key===e.key}const lm=({key:n})=>n??null,Ha=({ref:n,ref_key:e,ref_for:t})=>(typeof n=="number"&&(n=""+n),n!=null?nn(n)||bn(n)||pt(n)?{i:Kn,r:n,k:e,f:!!t}:n:null);function Se(n,e=null,t=null,i=0,r=null,s=n===pn?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:n,props:e,key:e&&lm(e),ref:e&&Ha(e),scopeId:Np,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Kn};return a?(sl(l,t),s&128&&n.normalize(l)):t&&(l.shapeFlag|=nn(t)?8:16),Oo>0&&!o&&zn&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&zn.push(l),l}const Ln=N0;function N0(n,e=null,t=null,i=0,r=null,s=!1){if((!n||n===o0)&&(n=di),nh(n)){const a=Os(n,e,!0);return t&&sl(a,t),Oo>0&&!s&&zn&&(a.shapeFlag&6?zn[zn.indexOf(n)]=a:zn.push(a)),a.patchFlag=-2,a}if(j0(n)&&(n=n.__vccOpts),e){e=F0(e);let{class:a,style:l}=e;a&&!nn(a)&&(e.class=Ci(a)),zt(l)&&(Zu(l)&&!at(l)&&(l=un({},l)),e.style=Xo(l))}const o=nn(n)?1:sm(n)?128:yl(n)?64:zt(n)?4:pt(n)?2:0;return Se(n,e,t,i,r,o,s,!0)}function F0(n){return n?Zu(n)?un({},n):Zp(n)?un({},n[fm]||n):n:null}function Os(n,e,t=!1,i=!1){const{props:r,ref:s,patchFlag:o,children:a,transition:l}=n,c=e?O0(r||{},e):r,u={__v_isVNode:!0,__v_skip:!0,type:n.type,props:c,key:c&&lm(c),ref:e&&e.ref?t&&s?at(s)?s.concat(Ha(e)):[s,Ha(e)]:Ha(e):s,scopeId:n.scopeId,slotScopeIds:n.slotScopeIds,children:a,target:n.target,targetStart:n.targetStart,targetAnchor:n.targetAnchor,staticCount:n.staticCount,shapeFlag:n.shapeFlag,patchFlag:e&&n.type!==pn?o===-1?16:o|16:o,dynamicProps:n.dynamicProps,dynamicChildren:n.dynamicChildren,appContext:n.appContext,dirs:n.dirs,transition:l,component:n.component,suspense:n.suspense,ssContent:n.ssContent&&Os(n.ssContent),ssFallback:n.ssFallback&&Os(n.ssFallback),placeholder:n.placeholder,el:n.el,anchor:n.anchor,ctx:n.ctx,ce:n.ce,cacheIndex:n.cacheIndex};return l&&i&&bo(u,l.clone(u)),u}function qn(n=" ",e=0){return Ln(Sl,null,n,e)}function Zr(n="",e=!1){return e?(Kt(),U0(di,null,n)):Ln(di,null,n)}function Mi(n){return n==null||typeof n=="boolean"?Ln(di):at(n)?Ln(pn,null,n.slice()):nh(n)?Ji(n):Ln(Sl,null,String(n))}function Ji(n){return n.el===null&&n.patchFlag!==-1||n.memo?n:Os(n)}function sl(n,e){let t=0;const{shapeFlag:i}=n;if(e==null)e=null;else if(at(e))t=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),sl(n,r()),r._c&&(r._d=!0));return}else{t=32;const r=e._;!r&&!Zp(e)?e._ctx=Kn:r===3&&Kn&&(Kn.slots._===1?e._=1:(e._=2,n.patchFlag|=1024))}else if(pt(e)){if(i&65){sl(n,{default:e});return}e={default:e,_ctx:Kn},t=32}else e=String(e),i&64?(t=16,e=[qn(e)]):t=8;n.children=e,n.shapeFlag|=t}function O0(...n){const e={};for(let t=0;t<n.length;t++){const i=n[t];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=Ci([e.class,i.class]));else if(r==="style")e.style=Xo([e.style,i.style]);else if(dl(r)){const s=e[r],o=i[r];o&&s!==o&&!(at(s)&&s.includes(o))?e[r]=s?[].concat(s,o):o:o==null&&s==null&&!pl(r)&&(e[r]=o)}else r!==""&&(e[r]=i[r])}return e}function _i(n,e,t,i=null){fi(n,e,7,[t,i])}const B0=Xp();let cm=0;function V0(){return cm}function k0(n,e,t){const i=n.type,r=(e?e.appContext:n.appContext)||B0,s={uid:cm++,vnode:n,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new u_(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Qp(i,r),emitsOptions:jp(i,r),emit:null,emitted:null,propsDefaults:Gt,inheritAttrs:i.inheritAttrs,ctx:Gt,data:Gt,props:Gt,attrs:Gt,slots:Gt,refs:Gt,setupState:Gt,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=g0.bind(null,s),n.ce&&n.ce(s),s}let Dn=null;const z0=()=>Dn||Kn;let ol,Bo;{const n=gl(),e=(t,i)=>{let r;return(r=n[t])||(r=n[t]=[]),r.push(i),s=>{r.length>1?r.forEach(o=>o(s)):r[0](s)}};ol=e("__VUE_INSTANCE_SETTERS__",t=>Dn=t),Bo=e("__VUE_SSR_SETTERS__",t=>Vo=t)}const $o=n=>{const e=Dn;return ol(n),n.scope.on(),()=>{n.scope.off(),ol(e)}},nf=()=>{Dn&&Dn.scope.off(),ol(null)};function um(n){return n.vnode.shapeFlag&4}let Vo=!1;function H0(n,e=!1,t=!1){e&&Bo(e);const{props:i,children:r}=n.vnode,s=um(n);S0(n,i,s,e),A0(n,r,t||e);const o=s?G0(n,e):void 0;return e&&Bo(!1),o}function G0(n,e){const t=n.type;n.accessCache=Object.create(null),n.proxy=new Proxy(n.ctx,a0);const{setup:i}=t;if(i){Pi();const r=n.setupContext=i.length>1?X0(n):null,s=$o(n),o=jo(i,n,0,[n.props,r]),a=sp(o);if(Li(),s(),(a||n.sp)&&!To(n)&&Vp(n),a){if(o.then(nf,nf),e)return o.then(l=>{Bo(!0);try{rf(n,l,e)}finally{Bo(!1)}}).catch(l=>{xl(l,n,0,void 0,!0),n.ssrRender=(c,u)=>u("<!---->")});n.asyncDep=o}else rf(n,o)}else hm(n)}function rf(n,e,t){pt(e)?n.type.__ssrInlineRender?n.ssrRender=e:n.render=e:zt(e)&&(n.setupState=Cp(e)),hm(n)}function hm(n,e,t){const i=n.type;n.render||(n.render=i.render||wi);{const r=$o(n);Pi();try{l0(n)}finally{Li(),r()}}}const fm=Symbol(),W0={get(n,e){return Sn(n,"get",""),e===fm?n:n[e]}};function X0(n){const e=t=>{n.exposed=t||{}};return{attrs:new Proxy(n.attrs,W0),slots:n.slots,emit:n.emit,expose:e}}function bl(n){return n.exposed?n.exposeProxy||(n.exposeProxy=new Proxy(Cp(C_(n.exposed)),{get(e,t){if(t in e)return e[t];if(t in Ao)return Ao[t](n)},has(e,t){return t in e||t in Ao}})):n.proxy}function j0(n){return pt(n)&&"__vccOpts"in n}const Ro=(n,e)=>U_(n,e,Vo),$0="3.5.46";/**
* @vue/runtime-dom v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let qc;const sf=typeof window<"u"&&window.trustedTypes;if(sf)try{qc=sf.createPolicy("vue",{createHTML:n=>n})}catch{}const dm=qc?n=>qc.createHTML(n):n=>n,q0="http://www.w3.org/2000/svg",Y0="http://www.w3.org/1998/Math/MathML",Ki=typeof document<"u"?document:null,of=Ki&&Ki.createElement("template"),K0={insert:(n,e,t)=>{e.insertBefore(n,t||null)},remove:n=>{const e=n.parentNode;e&&e.removeChild(n)},createElement:(n,e,t,i)=>{const r=e==="svg"?Ki.createElementNS(q0,n):e==="mathml"?Ki.createElementNS(Y0,n):t?Ki.createElement(n,{is:t}):Ki.createElement(n);return n==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:n=>Ki.createTextNode(n),createComment:n=>Ki.createComment(n),setText:(n,e)=>{n.nodeValue=e},setElementText:(n,e)=>{n.textContent=e},parentNode:n=>n.parentNode,nextSibling:n=>n.nextSibling,querySelector:n=>Ki.querySelector(n),setScopeId(n,e){n.setAttribute(e,"")},insertStaticContent(n,e,t,i,r,s){const o=t?t.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),t),!(r===s||!(r=r.nextSibling)););else{of.innerHTML=dm(i==="svg"?`<svg>${n}</svg>`:i==="mathml"?`<math>${n}</math>`:n);const a=of.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,t)}return[o?o.nextSibling:e.firstChild,t?t.previousSibling:e.lastChild]}},Z0=Symbol("_vtc");function J0(n,e,t){const i=n[Z0];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?n.removeAttribute("class"):t?n.setAttribute("class",e):n.className=e}const af=Symbol("_vod"),Q0=Symbol("_vsh"),ev=Symbol(""),tv=/(?:^|;)\s*display\s*:/;function nv(n,e,t){const i=n.style,r=nn(t);let s=!1;if(t&&!r){if(e)if(nn(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();t[a]==null&&_o(i,a,"")}else for(const o in e)t[o]==null&&_o(i,o,"");for(const o in t){o==="display"&&(s=!0);const a=t[o];a!=null?rv(n,o,!nn(e)&&e?e[o]:void 0,a)||_o(i,o,a):_o(i,o,"")}}else if(r){if(e!==t){const o=i[ev];o&&(t+=";"+o),i.cssText=t,s=tv.test(t)}}else e&&n.removeAttribute("style");af in n&&((!r||e!==t)&&(n[af]=s?i.display:""),n[Q0]&&(i.display="none"))}const ca=/\s*!important$/;function _o(n,e,t){if(at(t))t.forEach(i=>_o(n,e,i));else if(t==null&&(t=""),e.startsWith("--"))ca.test(t)?n.setProperty(e,t.replace(ca,""),"important"):n.setProperty(e,t);else{const i=iv(n,e);ca.test(t)?n.setProperty(ns(i),t.replace(ca,""),"important"):n[i]=t}}const lf=["Webkit","Moz","ms"],Yl={};function iv(n,e){const t=Yl[e];if(t)return t;let i=ci(e);if(i!=="filter"&&i in n)return Yl[e]=i;i=lp(i);for(let r=0;r<lf.length;r++){const s=lf[r]+i;if(s in n)return Yl[e]=s}return e}function rv(n,e,t,i){return n.tagName==="TEXTAREA"&&(e==="width"||e==="height")&&nn(i)&&t===i}const cf="http://www.w3.org/1999/xlink";function uf(n,e,t,i,r,s=a_(e)){i&&e.startsWith("xlink:")?t==null?n.removeAttributeNS(cf,e.slice(6,e.length)):n.setAttributeNS(cf,e,t):t==null||s&&!up(t)?n.removeAttribute(e):n.setAttribute(e,s?"":Ri(t)?String(t):t)}function hf(n,e,t,i,r){if(e==="innerHTML"||e==="textContent"){t!=null&&(n[e]=e==="innerHTML"?dm(t):t);return}const s=n.tagName;if(e==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?n.getAttribute("value")||"":n.value,l=t==null?n.type==="checkbox"?"on":"":String(t);(a!==l||!("_value"in n))&&(n.value=l),t==null&&n.removeAttribute(e),n._value=t;return}let o=!1;if(t===""||t==null){const a=typeof n[e];a==="boolean"?t=up(t):t==null&&a==="string"?(t="",o=!0):a==="number"&&(t=0,o=!0)}try{n[e]=t}catch{}o&&n.removeAttribute(r||e)}function Wr(n,e,t,i){n.addEventListener(e,t,i)}function sv(n,e,t,i){n.removeEventListener(e,t,i)}const ff=Symbol("_vei");function ov(n,e,t,i,r=null){const s=n[ff]||(n[ff]={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=cv(e);if(i){const c=s[e]=fv(i,r);Wr(n,a,c,l)}else o&&(sv(n,a,o,l),s[e]=void 0)}}const av=/(Once|Passive|Capture)$/,lv=/^on:?(?:Once|Passive|Capture)$/;function cv(n){let e,t;for(;(t=n.match(av))&&!lv.test(n);)e||(e={}),n=n.slice(0,n.length-t[1].length),e[t[1].toLowerCase()]=!0;return[n[2]===":"?n.slice(3):ns(n.slice(2)),e]}let Kl=0;const uv=Promise.resolve(),hv=()=>Kl||(uv.then(()=>Kl=0),Kl=Date.now());function fv(n,e){const t=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=t.attached)return;const r=t.value;if(at(r)){const s=i.stopImmediatePropagation;i.stopImmediatePropagation=()=>{s.call(i),i._stopped=!0};const o=r.slice(),a=[i];for(let l=0;l<o.length&&!i._stopped;l++){const c=o[l];c&&fi(c,e,5,a)}}else fi(r,e,5,[i])};return t.value=n,t.attached=hv(),t}const df=n=>n.charCodeAt(0)===111&&n.charCodeAt(1)===110&&n.charCodeAt(2)>96&&n.charCodeAt(2)<123,dv=(n,e,t,i,r,s)=>{const o=r==="svg";e==="class"?J0(n,i,o):e==="style"?nv(n,t,i):dl(e)?pl(e)||ov(n,e,t,i,s):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):pv(n,e,i,o))?(hf(n,e,i),!n.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&uf(n,e,i,o,s,e!=="value")):n._isVueCE&&(mv(n,e)||n._def.__asyncLoader&&(/[A-Z]/.test(e)||!nn(i)))?hf(n,ci(e),i,s,e):(e==="true-value"?n._trueValue=i:e==="false-value"&&(n._falseValue=i),uf(n,e,i,o))};function pv(n,e,t,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in n&&df(e)&&pt(t));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&n.tagName==="IFRAME"||e==="form"||e==="list"&&n.tagName==="INPUT"||e==="type"&&n.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const r=n.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return df(e)&&nn(t)?!1:e in n}function mv(n,e){const t=n._def.props;if(!t)return!1;const i=ci(e);return Array.isArray(t)?t.some(r=>ci(r)===i):Object.keys(t).some(r=>ci(r)===i)}const al=n=>{const e=n.props["onUpdate:modelValue"]||!1;return at(e)?t=>ka(e,t):e};function gv(n){n.target.composing=!0}function pf(n){const e=n.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const qr=Symbol("_assign"),ua=Symbol("_initialValue");function Zl(n,e,t){return e&&(n=n.trim()),t&&(n=Wu(n)),n}const Jr={created(n,{modifiers:{lazy:e,trim:t,number:i}},r){n.parentNode&&(n.type==="text"?n[ua]=n.defaultValue.replace(/[\r\n]/g,""):n.type==="textarea"&&(n[ua]=n.defaultValue.replace(/\r\n?/g,`
`))),n[qr]=al(r);const s=i||r.props&&r.props.type==="number";Wr(n,e?"change":"input",o=>{o.target.composing||n[qr](Zl(n.value,t,s))}),(t||s)&&Wr(n,"change",()=>{n.value=Zl(n.value,t,s)}),e||(Wr(n,"compositionstart",gv),Wr(n,"compositionend",pf),Wr(n,"change",pf))},mounted(n,{value:e,modifiers:{trim:t,number:i}}){const r=e??"",s=n[ua];delete n[ua],s!==void 0&&(n.type==="text"||n.type==="textarea")&&n.value!==s?n[qr](Zl(n.value,t,i)):n.value=r},beforeUpdate(n,{value:e,oldValue:t,modifiers:{lazy:i,trim:r,number:s}},o){if(n[qr]=al(o),n.composing)return;const a=(s||n.type==="number")&&!/^0\d/.test(n.value)?Wu(n.value):n.value,l=e??"";if(a===l)return;const c=n.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===n&&n.type!=="range"&&(i&&e===t||r&&n.value.trim()===l)||(n.value=l)}},Ga={deep:!0,created(n,e,t){n[qr]=al(t),Wr(n,"change",()=>{const i=n._modelValue,r=_v(n),s=n.checked,o=n[qr];if(at(i)){const a=hp(i,r),l=a!==-1;if(s&&!l)o(i.concat(r));else if(!s&&l){const c=[...i];c.splice(a,1),o(c)}}else if(Fs(i)){const a=new Set(i);s?a.add(r):a.delete(r),o(a)}else o(pm(n,s))})},mounted:mf,beforeUpdate(n,e,t){n[qr]=al(t),mf(n,e,t)}};function mf(n,{value:e,oldValue:t},i){n._modelValue=e;let r;if(at(e))r=hp(e,i.props.value)>-1;else if(Fs(e))r=e.has(i.props.value);else{if(e===t)return;r=Ks(e,pm(n,!0))}n.checked!==r&&(n.checked=r)}function _v(n){return"_value"in n?n._value:n.value}function pm(n,e){const t=e?"_trueValue":"_falseValue";return t in n?n[t]:e}const vv=un({patchProp:dv},K0);let gf;function xv(){return gf||(gf=R0(vv))}const yv=((...n)=>{const e=xv().createApp(...n),{mount:t}=e;return e.mount=i=>{const r=Sv(i);if(!r)return;const s=e._component;!pt(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=t(r,!1,Mv(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e});function Mv(n){if(n instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&n instanceof MathMLElement)return"mathml"}function Sv(n){return nn(n)?document.querySelector(n):n}const mm=[{name:"正面碰撞 (-X)",dir:[1,0,0]},{name:"追尾碰撞 (+X)",dir:[-1,0,0]},{name:"左侧碰 (-Y)",dir:[0,1,0]},{name:"右侧碰 (+Y)",dir:[0,-1,0]},{name:"顶部压溃 (-Z)",dir:[0,0,1]},{name:"底部托底 (+Z)",dir:[0,0,-1]}];/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ih="171",Ls={ROTATE:0,DOLLY:1,PAN:2},ws={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},bv=0,_f=1,Ev=2,gm=1,Tv=2,Yi=3,Di=0,Bn=1,Yn=2,Sr=0,Is=1,vf=2,xf=3,yf=4,Av=5,Xr=100,wv=101,Rv=102,Cv=103,Pv=104,Lv=200,Iv=201,Dv=202,Uv=203,Yc=204,Kc=205,Nv=206,Fv=207,Ov=208,Bv=209,Vv=210,kv=211,zv=212,Hv=213,Gv=214,Zc=0,Jc=1,Qc=2,Bs=3,eu=4,tu=5,nu=6,iu=7,rh=0,Wv=1,Xv=2,br=0,jv=1,$v=2,qv=3,Yv=4,Kv=5,Zv=6,Jv=7,Mf="attached",Qv="detached",_m=300,Vs=301,ks=302,ru=303,su=304,El=306,zs=1e3,vr=1001,ll=1002,Un=1003,vm=1004,vo=1005,Hn=1006,Wa=1007,tr=1008,rr=1009,xm=1010,ym=1011,ko=1012,sh=1013,es=1014,li=1015,qo=1016,oh=1017,ah=1018,Hs=1020,Mm=35902,Sm=1021,bm=1022,Zn=1023,Em=1024,Tm=1025,Ds=1026,Gs=1027,lh=1028,ch=1029,Am=1030,uh=1031,hh=1033,Xa=33776,ja=33777,$a=33778,qa=33779,ou=35840,au=35841,lu=35842,cu=35843,uu=36196,hu=37492,fu=37496,du=37808,pu=37809,mu=37810,gu=37811,_u=37812,vu=37813,xu=37814,yu=37815,Mu=37816,Su=37817,bu=37818,Eu=37819,Tu=37820,Au=37821,Ya=36492,wu=36494,Ru=36495,wm=36283,Cu=36284,Pu=36285,Lu=36286,zo=2300,Ho=2301,Jl=2302,Sf=2400,bf=2401,Ef=2402,ex=2500,tx=0,Rm=1,Iu=2,nx=3200,ix=3201,fh=0,rx=1,gr="",ln="srgb",Nn="srgb-linear",cl="linear",Vt="srgb",us=7680,Tf=519,sx=512,ox=513,ax=514,Cm=515,lx=516,cx=517,ux=518,hx=519,Du=35044,Af="300 es",nr=2e3,ul=2001;class rs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const yn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let wf=1234567;const Co=Math.PI/180,Ws=180/Math.PI;function hi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(yn[n&255]+yn[n>>8&255]+yn[n>>16&255]+yn[n>>24&255]+"-"+yn[e&255]+yn[e>>8&255]+"-"+yn[e>>16&15|64]+yn[e>>24&255]+"-"+yn[t&63|128]+yn[t>>8&255]+"-"+yn[t>>16&255]+yn[t>>24&255]+yn[i&255]+yn[i>>8&255]+yn[i>>16&255]+yn[i>>24&255]).toLowerCase()}function yt(n,e,t){return Math.max(e,Math.min(t,n))}function dh(n,e){return(n%e+e)%e}function fx(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function dx(n,e,t){return n!==e?(t-n)/(e-n):0}function Po(n,e,t){return(1-t)*n+t*e}function px(n,e,t,i){return Po(n,e,1-Math.exp(-t*i))}function mx(n,e=1){return e-Math.abs(dh(n,e*2)-e)}function gx(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function _x(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function vx(n,e){return n+Math.floor(Math.random()*(e-n+1))}function xx(n,e){return n+Math.random()*(e-n)}function yx(n){return n*(.5-Math.random())}function Mx(n){n!==void 0&&(wf=n);let e=wf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Sx(n){return n*Co}function bx(n){return n*Ws}function Ex(n){return(n&n-1)===0&&n!==0}function Tx(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Ax(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function wx(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),f=o((e-i)/2),d=s((i-e)/2),v=o((i-e)/2);switch(r){case"XYX":n.set(a*u,l*h,l*f,a*c);break;case"YZY":n.set(l*f,a*u,l*h,a*c);break;case"ZXZ":n.set(l*h,l*f,a*u,a*c);break;case"XZX":n.set(a*u,l*v,l*d,a*c);break;case"YXY":n.set(l*d,a*u,l*v,a*c);break;case"ZYZ":n.set(l*v,l*d,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function oi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ot(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Pm={DEG2RAD:Co,RAD2DEG:Ws,generateUUID:hi,clamp:yt,euclideanModulo:dh,mapLinear:fx,inverseLerp:dx,lerp:Po,damp:px,pingpong:mx,smoothstep:gx,smootherstep:_x,randInt:vx,randFloat:xx,randFloatSpread:yx,seededRandom:Mx,degToRad:Sx,radToDeg:bx,isPowerOfTwo:Ex,ceilPowerOfTwo:Tx,floorPowerOfTwo:Ax,setQuaternionFromProperEuler:wx,normalize:Ot,denormalize:oi};class lt{constructor(e=0,t=0){lt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class gt{constructor(e,t,i,r,s,o,a,l,c){gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],f=i[2],d=i[5],v=i[8],x=r[0],_=r[3],p=r[6],A=r[1],R=r[4],M=r[7],F=r[2],I=r[5],U=r[8];return s[0]=o*x+a*A+l*F,s[3]=o*_+a*R+l*I,s[6]=o*p+a*M+l*U,s[1]=c*x+u*A+h*F,s[4]=c*_+u*R+h*I,s[7]=c*p+u*M+h*U,s[2]=f*x+d*A+v*F,s[5]=f*_+d*R+v*I,s[8]=f*p+d*M+v*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*s,d=c*s-o*l,v=t*h+i*f+r*d;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=h*x,e[1]=(r*c-u*i)*x,e[2]=(a*i-r*o)*x,e[3]=f*x,e[4]=(u*t-r*l)*x,e[5]=(r*s-a*t)*x,e[6]=d*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ql.makeScale(e,t)),this}rotate(e){return this.premultiply(Ql.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ql.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ql=new gt;function Lm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Go(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Rx(){const n=Go("canvas");return n.style.display="block",n}const Rf={};function As(n){n in Rf||(Rf[n]=!0,console.warn(n))}function Cx(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function Px(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Lx(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Cf=new gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pf=new gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ix(){const n={enabled:!0,workingColorSpace:Nn,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Vt&&(r.r=ir(r.r),r.g=ir(r.g),r.b=ir(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Vt&&(r.r=Us(r.r),r.g=Us(r.g),r.b=Us(r.b))),r},fromWorkingColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},toWorkingColorSpace:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===gr?cl:this.spaces[r].transfer},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Nn]:{primaries:e,whitePoint:i,transfer:cl,toXYZ:Cf,fromXYZ:Pf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:e,whitePoint:i,transfer:Vt,toXYZ:Cf,fromXYZ:Pf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),n}const Rt=Ix();function ir(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Us(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let hs;class Dx{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{hs===void 0&&(hs=Go("canvas")),hs.width=e.width,hs.height=e.height;const i=hs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=hs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Go("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=ir(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ir(t[i]/255)*255):t[i]=ir(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ux=0;class Im{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ux++}),this.uuid=hi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ec(r[o].image)):s.push(ec(r[o]))}else s=ec(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ec(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Dx.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Nx=0;class mn extends rs{constructor(e=mn.DEFAULT_IMAGE,t=mn.DEFAULT_MAPPING,i=vr,r=vr,s=Hn,o=tr,a=Zn,l=rr,c=mn.DEFAULT_ANISOTROPY,u=gr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nx++}),this.uuid=hi(),this.name="",this.source=new Im(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_m)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zs:e.x=e.x-Math.floor(e.x);break;case vr:e.x=e.x<0?0:1;break;case ll:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zs:e.y=e.y-Math.floor(e.y);break;case vr:e.y=e.y<0?0:1;break;case ll:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=_m;mn.DEFAULT_ANISOTROPY=1;class Ut{constructor(e=0,t=0,i=0,r=1){Ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],d=l[5],v=l[9],x=l[2],_=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-x)<.01&&Math.abs(v-_)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+x)<.1&&Math.abs(v+_)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const R=(c+1)/2,M=(d+1)/2,F=(p+1)/2,I=(u+f)/4,U=(h+x)/4,W=(v+_)/4;return R>M&&R>F?R<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(R),r=I/i,s=U/i):M>F?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=I/r,s=W/r):F<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(F),i=U/s,r=W/s),this.set(i,r,s,t),this}let A=Math.sqrt((_-v)*(_-v)+(h-x)*(h-x)+(f-u)*(f-u));return Math.abs(A)<.001&&(A=1),this.x=(_-v)/A,this.y=(h-x)/A,this.z=(f-u)/A,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this.w=yt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this.w=yt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Fx extends rs{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ut(0,0,e,t),this.scissorTest=!1,this.viewport=new Ut(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Hn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new mn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Im(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ts extends Fx{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Dm extends mn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Un,this.minFilter=Un,this.wrapR=vr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ox extends mn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Un,this.minFilter=Un,this.wrapR=vr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ui{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const f=s[o+0],d=s[o+1],v=s[o+2],x=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=v,e[t+3]=x;return}if(h!==x||l!==f||c!==d||u!==v){let _=1-a;const p=l*f+c*d+u*v+h*x,A=p>=0?1:-1,R=1-p*p;if(R>Number.EPSILON){const F=Math.sqrt(R),I=Math.atan2(F,p*A);_=Math.sin(_*I)/F,a=Math.sin(a*I)/F}const M=a*A;if(l=l*_+f*M,c=c*_+d*M,u=u*_+v*M,h=h*_+x*M,_===1-a){const F=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=F,c*=F,u*=F,h*=F}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],f=s[o+1],d=s[o+2],v=s[o+3];return e[t]=a*v+u*h+l*d-c*f,e[t+1]=l*v+u*f+c*h-a*d,e[t+2]=c*v+u*d+a*f-l*h,e[t+3]=u*v-a*h-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),f=l(i/2),d=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=f*u*h+c*d*v,this._y=c*d*h-f*u*v,this._z=c*u*v+f*d*h,this._w=c*u*h-f*d*v;break;case"YXZ":this._x=f*u*h+c*d*v,this._y=c*d*h-f*u*v,this._z=c*u*v-f*d*h,this._w=c*u*h+f*d*v;break;case"ZXY":this._x=f*u*h-c*d*v,this._y=c*d*h+f*u*v,this._z=c*u*v+f*d*h,this._w=c*u*h-f*d*v;break;case"ZYX":this._x=f*u*h-c*d*v,this._y=c*d*h+f*u*v,this._z=c*u*v-f*d*h,this._w=c*u*h+f*d*v;break;case"YZX":this._x=f*u*h+c*d*v,this._y=c*d*h+f*u*v,this._z=c*u*v-f*d*h,this._w=c*u*h-f*d*v;break;case"XZY":this._x=f*u*h-c*d*v,this._y=c*d*h-f*u*v,this._z=c*u*v+f*d*h,this._w=c*u*h+f*d*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=i+a+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>h){const d=2*Math.sqrt(1+i-a-h);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>h){const d=2*Math.sqrt(1+a-i-h);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+h-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-t;return this._w=d*o+t*this._w,this._x=d*i+t*this._x,this._y=d*r+t*this._y,this._z=d*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(e=0,t=0,i=0){k.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Lf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Lf.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return tc.copy(this).projectOnVector(e),this.sub(tc)}reflect(e){return this.sub(tc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const tc=new k,Lf=new Ui;class pi{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ti):ti.fromBufferAttribute(s,o),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ha.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ha.copy(i.boundingBox)),ha.applyMatrix4(e.matrixWorld),this.union(ha)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(oo),fa.subVectors(this.max,oo),fs.subVectors(e.a,oo),ds.subVectors(e.b,oo),ps.subVectors(e.c,oo),lr.subVectors(ds,fs),cr.subVectors(ps,ds),Nr.subVectors(fs,ps);let t=[0,-lr.z,lr.y,0,-cr.z,cr.y,0,-Nr.z,Nr.y,lr.z,0,-lr.x,cr.z,0,-cr.x,Nr.z,0,-Nr.x,-lr.y,lr.x,0,-cr.y,cr.x,0,-Nr.y,Nr.x,0];return!nc(t,fs,ds,ps,fa)||(t=[1,0,0,0,1,0,0,0,1],!nc(t,fs,ds,ps,fa))?!1:(da.crossVectors(lr,cr),t=[da.x,da.y,da.z],nc(t,fs,ds,ps,fa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Gi=[new k,new k,new k,new k,new k,new k,new k,new k],ti=new k,ha=new pi,fs=new k,ds=new k,ps=new k,lr=new k,cr=new k,Nr=new k,oo=new k,fa=new k,da=new k,Fr=new k;function nc(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Fr.fromArray(n,s);const a=r.x*Math.abs(Fr.x)+r.y*Math.abs(Fr.y)+r.z*Math.abs(Fr.z),l=e.dot(Fr),c=t.dot(Fr),u=i.dot(Fr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Bx=new pi,ao=new k,ic=new k;class Ni{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Bx.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ao.subVectors(e,this.center);const t=ao.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ao,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ic.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ao.copy(e.center).add(ic)),this.expandByPoint(ao.copy(e.center).sub(ic))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wi=new k,rc=new k,pa=new k,ur=new k,sc=new k,ma=new k,oc=new k;class Zs{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wi.copy(this.origin).addScaledVector(this.direction,t),Wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){rc.copy(e).add(t).multiplyScalar(.5),pa.copy(t).sub(e).normalize(),ur.copy(this.origin).sub(rc);const s=e.distanceTo(t)*.5,o=-this.direction.dot(pa),a=ur.dot(this.direction),l=-ur.dot(pa),c=ur.lengthSq(),u=Math.abs(1-o*o);let h,f,d,v;if(u>0)if(h=o*l-a,f=o*a-l,v=s*u,h>=0)if(f>=-v)if(f<=v){const x=1/u;h*=x,f*=x,d=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f<=-v?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),d=-h*h+f*(f+2*l)+c):f<=v?(h=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),d=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(rc).addScaledVector(pa,f),d}intersectSphere(e,t){Wi.subVectors(e.center,this.origin);const i=Wi.dot(this.direction),r=Wi.dot(Wi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Wi)!==null}intersectTriangle(e,t,i,r,s){sc.subVectors(t,e),ma.subVectors(i,e),oc.crossVectors(sc,ma);let o=this.direction.dot(oc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ur.subVectors(this.origin,e);const l=a*this.direction.dot(ma.crossVectors(ur,ma));if(l<0)return null;const c=a*this.direction.dot(sc.cross(ur));if(c<0||l+c>o)return null;const u=-a*ur.dot(oc);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mt{constructor(e,t,i,r,s,o,a,l,c,u,h,f,d,v,x,_){mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,f,d,v,x,_)}set(e,t,i,r,s,o,a,l,c,u,h,f,d,v,x,_){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=f,p[3]=d,p[7]=v,p[11]=x,p[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/ms.setFromMatrixColumn(e,0).length(),s=1/ms.setFromMatrixColumn(e,1).length(),o=1/ms.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*u,d=o*h,v=a*u,x=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=d+v*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=v+d*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,d=l*h,v=c*u,x=c*h;t[0]=f+x*a,t[4]=v*a-d,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-v,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,d=l*h,v=c*u,x=c*h;t[0]=f-x*a,t[4]=-o*h,t[8]=v+d*a,t[1]=d+v*a,t[5]=o*u,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,d=o*h,v=a*u,x=a*h;t[0]=l*u,t[4]=v*c-d,t[8]=f*c+x,t[1]=l*h,t[5]=x*c+f,t[9]=d*c-v,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,d=o*c,v=a*l,x=a*c;t[0]=l*u,t[4]=x-f*h,t[8]=v*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=d*h+v,t[10]=f-x*h}else if(e.order==="XZY"){const f=o*l,d=o*c,v=a*l,x=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+x,t[5]=o*u,t[9]=d*h-v,t[2]=v*h-d,t[6]=a*u,t[10]=x*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Vx,e,kx)}lookAt(e,t,i){const r=this.elements;return Vn.subVectors(e,t),Vn.lengthSq()===0&&(Vn.z=1),Vn.normalize(),hr.crossVectors(i,Vn),hr.lengthSq()===0&&(Math.abs(i.z)===1?Vn.x+=1e-4:Vn.z+=1e-4,Vn.normalize(),hr.crossVectors(i,Vn)),hr.normalize(),ga.crossVectors(Vn,hr),r[0]=hr.x,r[4]=ga.x,r[8]=Vn.x,r[1]=hr.y,r[5]=ga.y,r[9]=Vn.y,r[2]=hr.z,r[6]=ga.z,r[10]=Vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],f=i[9],d=i[13],v=i[2],x=i[6],_=i[10],p=i[14],A=i[3],R=i[7],M=i[11],F=i[15],I=r[0],U=r[4],W=r[8],w=r[12],E=r[1],B=r[5],ue=r[9],ne=r[13],de=r[2],be=r[6],H=r[10],Q=r[14],z=r[3],ge=r[7],Ae=r[11],ke=r[15];return s[0]=o*I+a*E+l*de+c*z,s[4]=o*U+a*B+l*be+c*ge,s[8]=o*W+a*ue+l*H+c*Ae,s[12]=o*w+a*ne+l*Q+c*ke,s[1]=u*I+h*E+f*de+d*z,s[5]=u*U+h*B+f*be+d*ge,s[9]=u*W+h*ue+f*H+d*Ae,s[13]=u*w+h*ne+f*Q+d*ke,s[2]=v*I+x*E+_*de+p*z,s[6]=v*U+x*B+_*be+p*ge,s[10]=v*W+x*ue+_*H+p*Ae,s[14]=v*w+x*ne+_*Q+p*ke,s[3]=A*I+R*E+M*de+F*z,s[7]=A*U+R*B+M*be+F*ge,s[11]=A*W+R*ue+M*H+F*Ae,s[15]=A*w+R*ne+M*Q+F*ke,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],d=e[14],v=e[3],x=e[7],_=e[11],p=e[15];return v*(+s*l*h-r*c*h-s*a*f+i*c*f+r*a*d-i*l*d)+x*(+t*l*d-t*c*f+s*o*f-r*o*d+r*c*u-s*l*u)+_*(+t*c*h-t*a*d-s*o*h+i*o*d+s*a*u-i*c*u)+p*(-r*a*u-t*l*h+t*a*f+r*o*h-i*o*f+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],d=e[11],v=e[12],x=e[13],_=e[14],p=e[15],A=h*_*c-x*f*c+x*l*d-a*_*d-h*l*p+a*f*p,R=v*f*c-u*_*c-v*l*d+o*_*d+u*l*p-o*f*p,M=u*x*c-v*h*c+v*a*d-o*x*d-u*a*p+o*h*p,F=v*h*l-u*x*l-v*a*f+o*x*f+u*a*_-o*h*_,I=t*A+i*R+r*M+s*F;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/I;return e[0]=A*U,e[1]=(x*f*s-h*_*s-x*r*d+i*_*d+h*r*p-i*f*p)*U,e[2]=(a*_*s-x*l*s+x*r*c-i*_*c-a*r*p+i*l*p)*U,e[3]=(h*l*s-a*f*s-h*r*c+i*f*c+a*r*d-i*l*d)*U,e[4]=R*U,e[5]=(u*_*s-v*f*s+v*r*d-t*_*d-u*r*p+t*f*p)*U,e[6]=(v*l*s-o*_*s-v*r*c+t*_*c+o*r*p-t*l*p)*U,e[7]=(o*f*s-u*l*s+u*r*c-t*f*c-o*r*d+t*l*d)*U,e[8]=M*U,e[9]=(v*h*s-u*x*s-v*i*d+t*x*d+u*i*p-t*h*p)*U,e[10]=(o*x*s-v*a*s+v*i*c-t*x*c-o*i*p+t*a*p)*U,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*d-t*a*d)*U,e[12]=F*U,e[13]=(u*x*r-v*h*r+v*i*f-t*x*f-u*i*_+t*h*_)*U,e[14]=(v*a*r-o*x*r-v*i*l+t*x*l+o*i*_-t*a*_)*U,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*f+t*a*f)*U,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,f=s*c,d=s*u,v=s*h,x=o*u,_=o*h,p=a*h,A=l*c,R=l*u,M=l*h,F=i.x,I=i.y,U=i.z;return r[0]=(1-(x+p))*F,r[1]=(d+M)*F,r[2]=(v-R)*F,r[3]=0,r[4]=(d-M)*I,r[5]=(1-(f+p))*I,r[6]=(_+A)*I,r[7]=0,r[8]=(v+R)*U,r[9]=(_-A)*U,r[10]=(1-(f+x))*U,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=ms.set(r[0],r[1],r[2]).length();const o=ms.set(r[4],r[5],r[6]).length(),a=ms.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ni.copy(this);const c=1/s,u=1/o,h=1/a;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=u,ni.elements[5]*=u,ni.elements[6]*=u,ni.elements[8]*=h,ni.elements[9]*=h,ni.elements[10]*=h,t.setFromRotationMatrix(ni),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=nr){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),h=(t+e)/(t-e),f=(i+r)/(i-r);let d,v;if(a===nr)d=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===ul)d=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=nr){const l=this.elements,c=1/(t-e),u=1/(i-r),h=1/(o-s),f=(t+e)*c,d=(i+r)*u;let v,x;if(a===nr)v=(o+s)*h,x=-2*h;else if(a===ul)v=s*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ms=new k,ni=new mt,Vx=new k(0,0,0),kx=new k(1,1,1),hr=new k,ga=new k,Vn=new k,If=new mt,Df=new Ui;class mi{constructor(e=0,t=0,i=0,r=mi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(yt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-yt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(yt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return If.makeRotationFromQuaternion(e),this.setFromRotationMatrix(If,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Df.setFromEuler(this),this.setFromQuaternion(Df,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mi.DEFAULT_ORDER="XYZ";class ph{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let zx=0;const Uf=new k,gs=new Ui,Xi=new mt,_a=new k,lo=new k,Hx=new k,Gx=new Ui,Nf=new k(1,0,0),Ff=new k(0,1,0),Of=new k(0,0,1),Bf={type:"added"},Wx={type:"removed"},_s={type:"childadded",child:null},ac={type:"childremoved",child:null};class Qt extends rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zx++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Qt.DEFAULT_UP.clone();const e=new k,t=new mi,i=new Ui,r=new k(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new mt},normalMatrix:{value:new gt}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=Qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ph,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gs.setFromAxisAngle(e,t),this.quaternion.multiply(gs),this}rotateOnWorldAxis(e,t){return gs.setFromAxisAngle(e,t),this.quaternion.premultiply(gs),this}rotateX(e){return this.rotateOnAxis(Nf,e)}rotateY(e){return this.rotateOnAxis(Ff,e)}rotateZ(e){return this.rotateOnAxis(Of,e)}translateOnAxis(e,t){return Uf.copy(e).applyQuaternion(this.quaternion),this.position.add(Uf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nf,e)}translateY(e){return this.translateOnAxis(Ff,e)}translateZ(e){return this.translateOnAxis(Of,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?_a.copy(e):_a.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),lo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xi.lookAt(lo,_a,this.up):Xi.lookAt(_a,lo,this.up),this.quaternion.setFromRotationMatrix(Xi),r&&(Xi.extractRotation(r.matrixWorld),gs.setFromRotationMatrix(Xi),this.quaternion.premultiply(gs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Bf),_s.child=e,this.dispatchEvent(_s),_s.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wx),ac.child=e,this.dispatchEvent(ac),ac.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Bf),_s.child=e,this.dispatchEvent(_s),_s.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,e,Hx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,Gx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Qt.DEFAULT_UP=new k(0,1,0);Qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new k,ji=new k,lc=new k,$i=new k,vs=new k,xs=new k,Vf=new k,cc=new k,uc=new k,hc=new k,fc=new Ut,dc=new Ut,pc=new Ut;class ai{constructor(e=new k,t=new k,i=new k){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ii.subVectors(e,t),r.cross(ii);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ii.subVectors(r,t),ji.subVectors(i,t),lc.subVectors(e,t);const o=ii.dot(ii),a=ii.dot(ji),l=ii.dot(lc),c=ji.dot(ji),u=ji.dot(lc),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,d=(c*l-a*u)*f,v=(o*u-a*l)*f;return s.set(1-d-v,v,d)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,$i)===null?!1:$i.x>=0&&$i.y>=0&&$i.x+$i.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,$i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,$i.x),l.addScaledVector(o,$i.y),l.addScaledVector(a,$i.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return fc.setScalar(0),dc.setScalar(0),pc.setScalar(0),fc.fromBufferAttribute(e,t),dc.fromBufferAttribute(e,i),pc.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(fc,s.x),o.addScaledVector(dc,s.y),o.addScaledVector(pc,s.z),o}static isFrontFacing(e,t,i,r){return ii.subVectors(i,t),ji.subVectors(e,t),ii.cross(ji).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),ji.subVectors(this.a,this.b),ii.cross(ji).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ai.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ai.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return ai.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return ai.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ai.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;vs.subVectors(r,i),xs.subVectors(s,i),cc.subVectors(e,i);const l=vs.dot(cc),c=xs.dot(cc);if(l<=0&&c<=0)return t.copy(i);uc.subVectors(e,r);const u=vs.dot(uc),h=xs.dot(uc);if(u>=0&&h<=u)return t.copy(r);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(vs,o);hc.subVectors(e,s);const d=vs.dot(hc),v=xs.dot(hc);if(v>=0&&d<=v)return t.copy(s);const x=d*c-l*v;if(x<=0&&c>=0&&v<=0)return a=c/(c-v),t.copy(i).addScaledVector(xs,a);const _=u*v-d*h;if(_<=0&&h-u>=0&&d-v>=0)return Vf.subVectors(s,r),a=(h-u)/(h-u+(d-v)),t.copy(r).addScaledVector(Vf,a);const p=1/(_+x+f);return o=x*p,a=f*p,t.copy(i).addScaledVector(vs,o).addScaledVector(xs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Um={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fr={h:0,s:0,l:0},va={h:0,s:0,l:0};function mc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Rt.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Rt.workingColorSpace){if(e=dh(e,1),t=yt(t,0,1),i=yt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=mc(o,s,e+1/3),this.g=mc(o,s,e),this.b=mc(o,s,e-1/3)}return Rt.toWorkingColorSpace(this,r),this}setStyle(e,t=ln){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const i=Um[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ir(e.r),this.g=ir(e.g),this.b=ir(e.b),this}copyLinearToSRGB(e){return this.r=Us(e.r),this.g=Us(e.g),this.b=Us(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return Rt.fromWorkingColorSpace(Mn.copy(this),e),Math.round(yt(Mn.r*255,0,255))*65536+Math.round(yt(Mn.g*255,0,255))*256+Math.round(yt(Mn.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rt.workingColorSpace){Rt.fromWorkingColorSpace(Mn.copy(this),t);const i=Mn.r,r=Mn.g,s=Mn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Rt.workingColorSpace){return Rt.fromWorkingColorSpace(Mn.copy(this),t),e.r=Mn.r,e.g=Mn.g,e.b=Mn.b,e}getStyle(e=ln){Rt.fromWorkingColorSpace(Mn.copy(this),e);const t=Mn.r,i=Mn.g,r=Mn.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(fr),this.setHSL(fr.h+e,fr.s+t,fr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(fr),e.getHSL(va);const i=Po(fr.h,va.h,t),r=Po(fr.s,va.s,t),s=Po(fr.l,va.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Mn=new tt;tt.NAMES=Um;let Xx=0;class Gn extends rs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xx++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=Is,this.side=Di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yc,this.blendDst=Kc,this.blendEquation=Xr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=us,this.stencilZFail=us,this.stencilZPass=us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Is&&(i.blending=this.blending),this.side!==Di&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Yc&&(i.blendSrc=this.blendSrc),this.blendDst!==Kc&&(i.blendDst=this.blendDst),this.blendEquation!==Xr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Bs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tf&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==us&&(i.stencilFail=this.stencilFail),this.stencilZFail!==us&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==us&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ti extends Gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const rn=new k,xa=new lt;class Jt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Du,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)xa.fromBufferAttribute(this,t),xa.applyMatrix3(e),this.setXY(t,xa.x,xa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix3(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=oi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ot(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=oi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=oi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=oi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=oi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),r=Ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),r=Ot(r,this.array),s=Ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Du&&(e.usage=this.usage),e}}class Nm extends Jt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fm extends Jt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Zt extends Jt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let jx=0;const Xn=new mt,gc=new Qt,ys=new k,kn=new pi,co=new pi,dn=new k;class sn extends rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jx++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lm(e)?Fm:Nm)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new gt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xn.makeRotationFromQuaternion(e),this.applyMatrix4(Xn),this}rotateX(e){return Xn.makeRotationX(e),this.applyMatrix4(Xn),this}rotateY(e){return Xn.makeRotationY(e),this.applyMatrix4(Xn),this}rotateZ(e){return Xn.makeRotationZ(e),this.applyMatrix4(Xn),this}translate(e,t,i){return Xn.makeTranslation(e,t,i),this.applyMatrix4(Xn),this}scale(e,t,i){return Xn.makeScale(e,t,i),this.applyMatrix4(Xn),this}lookAt(e){return gc.lookAt(e),gc.updateMatrix(),this.applyMatrix4(gc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ys).negate(),this.translate(ys.x,ys.y,ys.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Zt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];kn.setFromBufferAttribute(s),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,kn.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,kn.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(kn.min),this.boundingBox.expandByPoint(kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ni);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const i=this.boundingSphere.center;if(kn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];co.setFromBufferAttribute(a),this.morphTargetsRelative?(dn.addVectors(kn.min,co.min),kn.expandByPoint(dn),dn.addVectors(kn.max,co.max),kn.expandByPoint(dn)):(kn.expandByPoint(co.min),kn.expandByPoint(co.max))}kn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)dn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(dn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)dn.fromBufferAttribute(a,c),l&&(ys.fromBufferAttribute(e,c),dn.add(ys)),r=Math.max(r,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jt(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let W=0;W<i.count;W++)a[W]=new k,l[W]=new k;const c=new k,u=new k,h=new k,f=new lt,d=new lt,v=new lt,x=new k,_=new k;function p(W,w,E){c.fromBufferAttribute(i,W),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,E),f.fromBufferAttribute(s,W),d.fromBufferAttribute(s,w),v.fromBufferAttribute(s,E),u.sub(c),h.sub(c),d.sub(f),v.sub(f);const B=1/(d.x*v.y-v.x*d.y);isFinite(B)&&(x.copy(u).multiplyScalar(v.y).addScaledVector(h,-d.y).multiplyScalar(B),_.copy(h).multiplyScalar(d.x).addScaledVector(u,-v.x).multiplyScalar(B),a[W].add(x),a[w].add(x),a[E].add(x),l[W].add(_),l[w].add(_),l[E].add(_))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let W=0,w=A.length;W<w;++W){const E=A[W],B=E.start,ue=E.count;for(let ne=B,de=B+ue;ne<de;ne+=3)p(e.getX(ne+0),e.getX(ne+1),e.getX(ne+2))}const R=new k,M=new k,F=new k,I=new k;function U(W){F.fromBufferAttribute(r,W),I.copy(F);const w=a[W];R.copy(w),R.sub(F.multiplyScalar(F.dot(w))).normalize(),M.crossVectors(I,w);const B=M.dot(l[W])<0?-1:1;o.setXYZW(W,R.x,R.y,R.z,B)}for(let W=0,w=A.length;W<w;++W){const E=A[W],B=E.start,ue=E.count;for(let ne=B,de=B+ue;ne<de;ne+=3)U(e.getX(ne+0)),U(e.getX(ne+1)),U(e.getX(ne+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const r=new k,s=new k,o=new k,a=new k,l=new k,c=new k,u=new k,h=new k;if(e)for(let f=0,d=e.count;f<d;f+=3){const v=e.getX(f+0),x=e.getX(f+1),_=e.getX(f+2);r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,_),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,_),a.add(u),l.add(u),c.add(u),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(_,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)dn.fromBufferAttribute(e,t),dn.normalize(),e.setXYZ(t,dn.x,dn.y,dn.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let d=0,v=0;for(let x=0,_=l.length;x<_;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*u;for(let p=0;p<u;p++)f[v++]=c[d++]}return new Jt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new sn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],d=e(f,i);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const d=c[h];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const kf=new mt,Or=new Zs,ya=new Ni,zf=new k,Ma=new k,Sa=new k,ba=new k,_c=new k,Ea=new k,Hf=new k,Ta=new k;class cn extends Qt{constructor(e=new sn,t=new Ti){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Ea.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(_c.fromBufferAttribute(h,e),o?Ea.addScaledVector(_c,u):Ea.addScaledVector(_c.sub(t),u))}t.add(Ea)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ya.copy(i.boundingSphere),ya.applyMatrix4(s),Or.copy(e.ray).recast(e.near),!(ya.containsPoint(Or.origin)===!1&&(Or.intersectSphere(ya,zf)===null||Or.origin.distanceToSquared(zf)>(e.far-e.near)**2))&&(kf.copy(s).invert(),Or.copy(e.ray).applyMatrix4(kf),!(i.boundingBox!==null&&Or.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Or)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,x=f.length;v<x;v++){const _=f[v],p=o[_.materialIndex],A=Math.max(_.start,d.start),R=Math.min(a.count,Math.min(_.start+_.count,d.start+d.count));for(let M=A,F=R;M<F;M+=3){const I=a.getX(M),U=a.getX(M+1),W=a.getX(M+2);r=Aa(this,p,e,i,c,u,h,I,U,W),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const v=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let _=v,p=x;_<p;_+=3){const A=a.getX(_),R=a.getX(_+1),M=a.getX(_+2);r=Aa(this,o,e,i,c,u,h,A,R,M),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,x=f.length;v<x;v++){const _=f[v],p=o[_.materialIndex],A=Math.max(_.start,d.start),R=Math.min(l.count,Math.min(_.start+_.count,d.start+d.count));for(let M=A,F=R;M<F;M+=3){const I=M,U=M+1,W=M+2;r=Aa(this,p,e,i,c,u,h,I,U,W),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=_.materialIndex,t.push(r))}}else{const v=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let _=v,p=x;_<p;_+=3){const A=_,R=_+1,M=_+2;r=Aa(this,o,e,i,c,u,h,A,R,M),r&&(r.faceIndex=Math.floor(_/3),t.push(r))}}}}function $x(n,e,t,i,r,s,o,a){let l;if(e.side===Bn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Di,a),l===null)return null;Ta.copy(a),Ta.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ta);return c<t.near||c>t.far?null:{distance:c,point:Ta.clone(),object:n}}function Aa(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Ma),n.getVertexPosition(l,Sa),n.getVertexPosition(c,ba);const u=$x(n,e,t,i,Ma,Sa,ba,Hf);if(u){const h=new k;ai.getBarycoord(Hf,Ma,Sa,ba,h),r&&(u.uv=ai.getInterpolatedAttribute(r,a,l,c,h,new lt)),s&&(u.uv1=ai.getInterpolatedAttribute(s,a,l,c,h,new lt)),o&&(u.normal=ai.getInterpolatedAttribute(o,a,l,c,h,new k),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new k,materialIndex:0};ai.getNormal(Ma,Sa,ba,f.normal),u.face=f,u.barycoord=h}return u}class Yo extends sn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,d=0;v("z","y","x",-1,-1,i,t,e,o,s,0),v("z","y","x",1,-1,i,t,-e,o,s,1),v("x","z","y",1,1,e,i,t,r,o,2),v("x","z","y",1,-1,e,i,-t,r,o,3),v("x","y","z",1,-1,e,t,i,r,s,4),v("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(u,3)),this.setAttribute("uv",new Zt(h,2));function v(x,_,p,A,R,M,F,I,U,W,w){const E=M/U,B=F/W,ue=M/2,ne=F/2,de=I/2,be=U+1,H=W+1;let Q=0,z=0;const ge=new k;for(let Ae=0;Ae<H;Ae++){const ke=Ae*B-ne;for(let Ze=0;Ze<be;Ze++){const Mt=Ze*E-ue;ge[x]=Mt*A,ge[_]=ke*R,ge[p]=de,c.push(ge.x,ge.y,ge.z),ge[x]=0,ge[_]=0,ge[p]=I>0?1:-1,u.push(ge.x,ge.y,ge.z),h.push(Ze/U),h.push(1-Ae/W),Q+=1}}for(let Ae=0;Ae<W;Ae++)for(let ke=0;ke<U;ke++){const Ze=f+ke+be*Ae,Mt=f+ke+be*(Ae+1),_e=f+(ke+1)+be*(Ae+1),Le=f+(ke+1)+be*Ae;l.push(Ze,Mt,Le),l.push(Mt,_e,Le),z+=6}a.addGroup(d,z,w),d+=z,f+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Xs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Cn(n){const e={};for(let t=0;t<n.length;t++){const i=Xs(n[t]);for(const r in i)e[r]=i[r]}return e}function qx(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Om(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Rt.workingColorSpace}const Yx={clone:Xs,merge:Cn};var Kx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tr extends Gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kx,this.fragmentShader=Zx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xs(e.uniforms),this.uniformsGroups=qx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Bm extends Qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=nr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const dr=new k,Gf=new lt,Wf=new lt;class In extends Bm{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ws*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Co*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ws*2*Math.atan(Math.tan(Co*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){dr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(dr.x,dr.y).multiplyScalar(-e/dr.z),dr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(dr.x,dr.y).multiplyScalar(-e/dr.z)}getViewSize(e,t){return this.getViewBounds(e,Gf,Wf),t.subVectors(Wf,Gf)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Co*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ms=-90,Ss=1;class Jx extends Qt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new In(Ms,Ss,e,t);r.layers=this.layers,this.add(r);const s=new In(Ms,Ss,e,t);s.layers=this.layers,this.add(s);const o=new In(Ms,Ss,e,t);o.layers=this.layers,this.add(o);const a=new In(Ms,Ss,e,t);a.layers=this.layers,this.add(a);const l=new In(Ms,Ss,e,t);l.layers=this.layers,this.add(l);const c=new In(Ms,Ss,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===nr)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ul)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Vm extends mn{constructor(e,t,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Vs,super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Qx extends ts{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Vm(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Hn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Yo(5,5,5),s=new Tr({name:"CubemapFromEquirect",uniforms:Xs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bn,blending:Sr});s.uniforms.tEquirect.value=t;const o=new cn(r,s),a=t.minFilter;return t.minFilter===tr&&(t.minFilter=Hn),new Jx(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class ey extends Qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mi,this.environmentIntensity=1,this.environmentRotation=new mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ty{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Du,this.updateRanges=[],this.version=0,this.uuid=hi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const An=new k;class mh{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=oi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ot(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=oi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=oi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=oi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=oi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),r=Ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ot(t,this.array),i=Ot(i,this.array),r=Ot(r,this.array),s=Ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Jt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new mh(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Xf=new k,jf=new Ut,$f=new Ut,ny=new k,qf=new mt,wa=new k,vc=new Ni,Yf=new mt,xc=new Zs;class iy extends cn{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Mf,this.bindMatrix=new mt,this.bindMatrixInverse=new mt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new pi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,wa),this.boundingBox.expandByPoint(wa)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ni),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,wa),this.boundingSphere.expandByPoint(wa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,r=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vc.copy(this.boundingSphere),vc.applyMatrix4(r),e.ray.intersectsSphere(vc)!==!1&&(Yf.copy(r).invert(),xc.copy(e.ray).applyMatrix4(Yf),!(this.boundingBox!==null&&xc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,xc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ut,t=this.geometry.attributes.skinWeight;for(let i=0,r=t.count;i<r;i++){e.fromBufferAttribute(t,i);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Mf?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Qv?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,r=this.geometry;jf.fromBufferAttribute(r.attributes.skinIndex,e),$f.fromBufferAttribute(r.attributes.skinWeight,e),Xf.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const o=$f.getComponent(s);if(o!==0){const a=jf.getComponent(s);qf.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(ny.copy(Xf).applyMatrix4(qf),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class km extends Qt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class zm extends mn{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Un,u=Un,h,f){super(null,o,a,l,c,u,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Kf=new mt,ry=new mt;class gh{constructor(e=[],t=[]){this.uuid=hi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,r=this.bones.length;i<r;i++)this.boneInverses.push(new mt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new mt;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,r=this.boneTexture;for(let s=0,o=e.length;s<o;s++){const a=e[s]?e[s].matrixWorld:ry;Kf.multiplyMatrices(a,t[s]),Kf.toArray(i,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new gh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new zm(t,e,e,Zn,li);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,r=e.bones.length;i<r;i++){const s=e.bones[i];let o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new km),this.bones.push(o),this.boneInverses.push(new mt().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let r=0,s=t.length;r<s;r++){const o=t[r];e.bones.push(o.uuid);const a=i[r];e.boneInverses.push(a.toArray())}return e}}class Uu extends Jt{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const bs=new mt,Zf=new mt,Ra=[],Jf=new pi,sy=new mt,uo=new cn,ho=new Ni;class oy extends cn{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Uu(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,sy)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new pi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,bs),Jf.copy(e.boundingBox).applyMatrix4(bs),this.boundingBox.union(Jf)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ni),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,bs),ho.copy(e.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(ho)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(uo.geometry=this.geometry,uo.material=this.material,uo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ho.copy(this.boundingSphere),ho.applyMatrix4(i),e.ray.intersectsSphere(ho)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,bs),Zf.multiplyMatrices(i,bs),uo.matrixWorld=Zf,uo.raycast(e,Ra);for(let o=0,a=Ra.length;o<a;o++){const l=Ra[o];l.instanceId=s,l.object=this,t.push(l)}Ra.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Uu(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new zm(new Float32Array(r*this.count),r,this.count,lh,li));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const yc=new k,ay=new k,ly=new gt;class Si{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=yc.subVectors(i,t).cross(ay.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(yc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||ly.getNormalMatrix(e),r=this.coplanarPoint(yc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Br=new Ni,Ca=new k;class _h{constructor(e=new Si,t=new Si,i=new Si,r=new Si,s=new Si,o=new Si){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=nr){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],h=r[6],f=r[7],d=r[8],v=r[9],x=r[10],_=r[11],p=r[12],A=r[13],R=r[14],M=r[15];if(i[0].setComponents(l-s,f-c,_-d,M-p).normalize(),i[1].setComponents(l+s,f+c,_+d,M+p).normalize(),i[2].setComponents(l+o,f+u,_+v,M+A).normalize(),i[3].setComponents(l-o,f-u,_-v,M-A).normalize(),i[4].setComponents(l-a,f-h,_-x,M-R).normalize(),t===nr)i[5].setComponents(l+a,f+h,_+x,M+R).normalize();else if(t===ul)i[5].setComponents(a,h,x,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Br.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Br.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Br)}intersectsSprite(e){return Br.center.set(0,0,0),Br.radius=.7071067811865476,Br.applyMatrix4(e.matrixWorld),this.intersectsSphere(Br)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Ca.x=r.normal.x>0?e.max.x:e.min.x,Ca.y=r.normal.y>0?e.max.y:e.min.y,Ca.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ca)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Qr extends Gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const hl=new k,fl=new k,Qf=new mt,fo=new Zs,Pa=new Ni,Mc=new k,ed=new k;class vh extends Qt{constructor(e=new sn,t=new Qr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)hl.fromBufferAttribute(t,r-1),fl.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=hl.distanceTo(fl);e.setAttribute("lineDistance",new Zt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Pa.copy(i.boundingSphere),Pa.applyMatrix4(r),Pa.radius+=s,e.ray.intersectsSphere(Pa)===!1)return;Qf.copy(r).invert(),fo.copy(e.ray).applyMatrix4(Qf);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){const d=Math.max(0,o.start),v=Math.min(u.count,o.start+o.count);for(let x=d,_=v-1;x<_;x+=c){const p=u.getX(x),A=u.getX(x+1),R=La(this,e,fo,l,p,A);R&&t.push(R)}if(this.isLineLoop){const x=u.getX(v-1),_=u.getX(d),p=La(this,e,fo,l,x,_);p&&t.push(p)}}else{const d=Math.max(0,o.start),v=Math.min(f.count,o.start+o.count);for(let x=d,_=v-1;x<_;x+=c){const p=La(this,e,fo,l,x,x+1);p&&t.push(p)}if(this.isLineLoop){const x=La(this,e,fo,l,v-1,d);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function La(n,e,t,i,r,s){const o=n.geometry.attributes.position;if(hl.fromBufferAttribute(o,r),fl.fromBufferAttribute(o,s),t.distanceSqToSegment(hl,fl,Mc,ed)>i)return;Mc.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Mc);if(!(l<e.near||l>e.far))return{distance:l,point:ed.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const td=new k,nd=new k;class Wo extends vh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)td.fromBufferAttribute(t,r),nd.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+td.distanceTo(nd);e.setAttribute("lineDistance",new Zt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class cy extends vh{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Rs extends Gn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const id=new mt,Nu=new Zs,Ia=new Ni,Da=new k;class Ka extends Qt{constructor(e=new sn,t=new Rs){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ia.copy(i.boundingSphere),Ia.applyMatrix4(r),Ia.radius+=s,e.ray.intersectsSphere(Ia)===!1)return;id.copy(r).invert(),Nu.copy(e.ray).applyMatrix4(id);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let v=f,x=d;v<x;v++){const _=c.getX(v);Da.fromBufferAttribute(h,_),rd(Da,_,l,r,e,t,this)}}else{const f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let v=f,x=d;v<x;v++)Da.fromBufferAttribute(h,v),rd(Da,v,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function rd(n,e,t,i,r,s,o){const a=Nu.distanceSqToPoint(n);if(a<t){const l=new k;Nu.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Ai extends Qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Hm extends mn{constructor(e,t,i,r,s,o,a,l,c,u=Ds){if(u!==Ds&&u!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ds&&(i=es),i===void 0&&u===Gs&&(i=Hs),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Un,this.minFilter=l!==void 0?l:Un,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Ko extends sn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,f=t/l,d=[],v=[],x=[],_=[];for(let p=0;p<u;p++){const A=p*f-o;for(let R=0;R<c;R++){const M=R*h-s;v.push(M,-A,0),x.push(0,0,1),_.push(R/a),_.push(1-p/l)}}for(let p=0;p<l;p++)for(let A=0;A<a;A++){const R=A+c*p,M=A+c*(p+1),F=A+1+c*(p+1),I=A+1+c*p;d.push(R,M,I),d.push(M,F,I)}this.setIndex(d),this.setAttribute("position",new Zt(v,3)),this.setAttribute("normal",new Zt(x,3)),this.setAttribute("uv",new Zt(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ko(e.width,e.height,e.widthSegments,e.heightSegments)}}class xh extends sn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new k,f=new k,d=[],v=[],x=[],_=[];for(let p=0;p<=i;p++){const A=[],R=p/i;let M=0;p===0&&o===0?M=.5/t:p===i&&l===Math.PI&&(M=-.5/t);for(let F=0;F<=t;F++){const I=F/t;h.x=-e*Math.cos(r+I*s)*Math.sin(o+R*a),h.y=e*Math.cos(o+R*a),h.z=e*Math.sin(r+I*s)*Math.sin(o+R*a),v.push(h.x,h.y,h.z),f.copy(h).normalize(),x.push(f.x,f.y,f.z),_.push(I+M,1-R),A.push(c++)}u.push(A)}for(let p=0;p<i;p++)for(let A=0;A<t;A++){const R=u[p][A+1],M=u[p][A],F=u[p+1][A],I=u[p+1][A+1];(p!==0||o>0)&&d.push(R,M,I),(p!==i-1||l<Math.PI)&&d.push(M,F,I)}this.setIndex(d),this.setAttribute("position",new Zt(v,3)),this.setAttribute("normal",new Zt(x,3)),this.setAttribute("uv",new Zt(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Tl extends Gn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fh,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Fi extends Tl{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new tt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new tt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new tt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class uy extends Gn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new tt(16777215),this.specular=new tt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fh,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class hy extends Gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class fy extends Gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Ua(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function dy(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function py(n){function e(r,s){return n[r]-n[s]}const t=n.length,i=new Array(t);for(let r=0;r!==t;++r)i[r]=r;return i.sort(e),i}function sd(n,e,t){const i=n.length,r=new n.constructor(i);for(let s=0,o=0;o!==i;++s){const a=t[s]*e;for(let l=0;l!==e;++l)r[o++]=n[a+l]}return r}function Gm(n,e,t,i){let r=1,s=n[0];for(;s!==void 0&&s[i]===void 0;)s=n[r++];if(s===void 0)return;let o=s[i];if(o!==void 0)if(Array.isArray(o))do o=s[i],o!==void 0&&(e.push(s.time),t.push.apply(t,o)),s=n[r++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[i],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=n[r++];while(s!==void 0);else do o=s[i],o!==void 0&&(e.push(s.time),t.push(o)),s=n[r++];while(s!==void 0)}class Zo{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=t[++i],e<r)break e}o=t.length;break t}if(!(e>=s)){const a=t[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){const a=i+o>>>1;e<t[a]?o=a:i=a+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=i[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class my extends Zo{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Sf,endingEnd:Sf}}intervalChanged_(e,t,i){const r=this.parameterPositions;let s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case bf:s=e,a=2*t-i;break;case Ef:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case bf:o=e,l=2*i-t;break;case Ef:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=t}const c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,i,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,v=(i-t)/(r-t),x=v*v,_=x*v,p=-f*_+2*f*x-f*v,A=(1+f)*_+(-1.5-2*f)*x+(-.5+f)*v+1,R=(-1-d)*_+(1.5+d)*x+.5*v,M=d*_-d*x;for(let F=0;F!==a;++F)s[F]=p*o[u+F]+A*o[c+F]+R*o[l+F]+M*o[h+F];return s}}class gy extends Zo{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-t)/(r-t),h=1-u;for(let f=0;f!==a;++f)s[f]=o[c+f]*h+o[l+f]*u;return s}}class _y extends Zo{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}}class Oi{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ua(t,this.TimeBufferType),this.values=Ua(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Ua(e.times,Array),values:Ua(e.values,Array)};const r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new _y(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new gy(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new my(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case zo:t=this.InterpolantFactoryMethodDiscrete;break;case Ho:t=this.InterpolantFactoryMethodLinear;break;case Jl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zo;case this.InterpolantFactoryMethodLinear:return Ho;case this.InterpolantFactoryMethodSmooth:return Jl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e}return this}trim(e,t){const i=this.times,r=i.length;let s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){const l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&dy(r))for(let a=0,l=r.length;a!==l;++a){const c=r[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===Jl,s=e.length-1;let o=1;for(let a=1;a<s;++a){let l=!1;const c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{const h=a*i,f=h-i,d=h+i;for(let v=0;v!==i;++v){const x=t[h+v];if(x!==t[f+v]||x!==t[d+v]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const h=a*i,f=o*i;for(let d=0;d!==i;++d)t[f+d]=t[h+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}}Oi.prototype.TimeBufferType=Float32Array;Oi.prototype.ValueBufferType=Float32Array;Oi.prototype.DefaultInterpolation=Ho;class Js extends Oi{constructor(e,t,i){super(e,t,i)}}Js.prototype.ValueTypeName="bool";Js.prototype.ValueBufferType=Array;Js.prototype.DefaultInterpolation=zo;Js.prototype.InterpolantFactoryMethodLinear=void 0;Js.prototype.InterpolantFactoryMethodSmooth=void 0;class Wm extends Oi{}Wm.prototype.ValueTypeName="color";class js extends Oi{}js.prototype.ValueTypeName="number";class vy extends Zo{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(r-t);let c=e*a;for(let u=c+a;c!==u;c+=4)Ui.slerpFlat(s,0,o,c-a,o,c,l);return s}}class $s extends Oi{InterpolantFactoryMethodLinear(e){return new vy(this.times,this.values,this.getValueSize(),e)}}$s.prototype.ValueTypeName="quaternion";$s.prototype.InterpolantFactoryMethodSmooth=void 0;class Qs extends Oi{constructor(e,t,i){super(e,t,i)}}Qs.prototype.ValueTypeName="string";Qs.prototype.ValueBufferType=Array;Qs.prototype.DefaultInterpolation=zo;Qs.prototype.InterpolantFactoryMethodLinear=void 0;Qs.prototype.InterpolantFactoryMethodSmooth=void 0;class qs extends Oi{}qs.prototype.ValueTypeName="vector";class xy{constructor(e="",t=-1,i=[],r=ex){this.name=e,this.tracks=i,this.duration=t,this.blendMode=r,this.uuid=hi(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,r=1/(e.fps||1);for(let o=0,a=i.length;o!==a;++o)t.push(My(i[o]).scale(r));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],i=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,o=i.length;s!==o;++s)t.push(Oi.toJSON(i[s]));return r}static CreateFromMorphTargetSequence(e,t,i,r){const s=t.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);const u=py(l);l=sd(l,1,u),c=sd(c,1,u),!r&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new js(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/i))}return new this(e,-1,o)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const r=e;i=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<i.length;r++)if(i[r].name===t)return i[r];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const r={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],u=c.name.match(s);if(u&&u.length>1){const h=u[1];let f=r[h];f||(r[h]=f=[]),f.push(c)}}const o=[];for(const a in r)o.push(this.CreateFromMorphTargetSequence(a,r[a],t,i));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(h,f,d,v,x){if(d.length!==0){const _=[],p=[];Gm(d,_,p,v),_.length!==0&&x.push(new h(f,_,p))}},r=[],s=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const f=c[h].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let v;for(v=0;v<f.length;v++)if(f[v].morphTargets)for(let x=0;x<f[v].morphTargets.length;x++)d[f[v].morphTargets[x]]=-1;for(const x in d){const _=[],p=[];for(let A=0;A!==f[v].morphTargets.length;++A){const R=f[v];_.push(R.time),p.push(R.morphTarget===x?1:0)}r.push(new js(".morphTargetInfluence["+x+"]",_,p))}l=d.length*o}else{const d=".bones["+t[h].name+"]";i(qs,d+".position",f,"pos",r),i($s,d+".quaternion",f,"rot",r),i(qs,d+".scale",f,"scl",r)}}return r.length===0?null:new this(s,l,r,a)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,r=e.length;i!==r;++i){const s=this.tracks[i];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function yy(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return js;case"vector":case"vector2":case"vector3":case"vector4":return qs;case"color":return Wm;case"quaternion":return $s;case"bool":case"boolean":return Js;case"string":return Qs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function My(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=yy(n.type);if(n.times===void 0){const t=[],i=[];Gm(n.keys,t,i,"value"),n.times=t,n.values=i}return e.parse!==void 0?e.parse(n):new e(n.name,n.times,n.values,n.interpolation)}const xr={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class Sy{constructor(e,t,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const d=c[h],v=c[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return v}return null}}}const by=new Sy;class Ar{constructor(e){this.manager=e!==void 0?e:by,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ar.DEFAULT_MATERIAL_NAME="__DEFAULT";const qi={};class Ey extends Error{constructor(e,t){super(e),this.response=t}}class Al extends Ar{constructor(e){super(e)}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=xr.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(qi[e]!==void 0){qi[e].push({onLoad:t,onProgress:i,onError:r});return}qi[e]=[],qi[e].push({onLoad:t,onProgress:i,onError:r});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=qi[e],h=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,v=d!==0;let x=0;const _=new ReadableStream({start(p){A();function A(){h.read().then(({done:R,value:M})=>{if(R)p.close();else{x+=M.byteLength;const F=new ProgressEvent("progress",{lengthComputable:v,loaded:x,total:d});for(let I=0,U=u.length;I<U;I++){const W=u[I];W.onProgress&&W.onProgress(F)}p.enqueue(M),A()}},R=>{p.error(R)})}}});return new Response(_)}else throw new Ey(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(a),f=h&&h[1]?h[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(v=>d.decode(v))}}}).then(c=>{xr.add(e,c);const u=qi[e];delete qi[e];for(let h=0,f=u.length;h<f;h++){const d=u[h];d.onLoad&&d.onLoad(c)}}).catch(c=>{const u=qi[e];if(u===void 0)throw this.manager.itemError(e),c;delete qi[e];for(let h=0,f=u.length;h<f;h++){const d=u[h];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Ty extends Ar{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=xr.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const a=Go("img");function l(){u(),xr.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class Ay extends Ar{constructor(e){super(e)}load(e,t,i,r){const s=new mn,o=new Ty(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},i,r),s}}class wl extends Qt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class wy extends wl{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new tt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Sc=new mt,od=new k,ad=new k;class yh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _h,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new Ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;od.setFromMatrixPosition(e.matrixWorld),t.position.copy(od),ad.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ad),t.updateMatrixWorld(),Sc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Sc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Ry extends yh{constructor(){super(new In(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=Ws*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(i!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=i,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Cy extends wl{constructor(e,t,i=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.target=new Qt,this.distance=i,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new Ry}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const ld=new mt,po=new k,bc=new k;class Py extends yh{constructor(){super(new In(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new lt(4,2),this._viewportCount=6,this._viewports=[new Ut(2,1,1,1),new Ut(0,1,1,1),new Ut(3,1,1,1),new Ut(1,1,1,1),new Ut(3,0,1,1),new Ut(1,0,1,1)],this._cubeDirections=[new k(1,0,0),new k(-1,0,0),new k(0,0,1),new k(0,0,-1),new k(0,1,0),new k(0,-1,0)],this._cubeUps=[new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,1,0),new k(0,0,1),new k(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),po.setFromMatrixPosition(e.matrixWorld),i.position.copy(po),bc.copy(i.position),bc.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(bc),i.updateMatrixWorld(),r.makeTranslation(-po.x,-po.y,-po.z),ld.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ld)}}class Ly extends wl{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new Py}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Mh extends Bm{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Iy extends yh{constructor(){super(new Mh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fu extends wl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Qt.DEFAULT_UP),this.updateMatrix(),this.target=new Qt,this.shadow=new Iy}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Lo{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,r=e.length;i<r;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Dy extends Ar{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=xr.get(e);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{r&&r(c)});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return xr.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),xr.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});xr.add(e,l),s.manager.itemStart(e)}}class Uy extends In{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}const Sh="\\[\\]\\.:\\/",Ny=new RegExp("["+Sh+"]","g"),bh="[^"+Sh+"]",Fy="[^"+Sh.replace("\\.","")+"]",Oy=/((?:WC+[\/:])*)/.source.replace("WC",bh),By=/(WCOD+)?/.source.replace("WCOD",Fy),Vy=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",bh),ky=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",bh),zy=new RegExp("^"+Oy+By+Vy+ky+"$"),Hy=["material","materials","bones","map"];class Gy{constructor(e,t,i){const r=i||Bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class Bt{constructor(e,t,i){this.path=t,this.parsedPath=i||Bt.parseTrackName(t),this.node=Bt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new Bt.Composite(e,t,i):new Bt(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ny,"")}static parseTrackName(e){const t=zy.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){const s=i.nodeName.substring(r+1);Hy.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===t||a.uuid===t)return a;const l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,r=t.propertyName;let s=t.propertyIndex;if(e||(e=Bt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[r];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Bt.Composite=Gy;Bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Bt.prototype.GetterByBindingType=[Bt.prototype._getValue_direct,Bt.prototype._getValue_array,Bt.prototype._getValue_arrayElement,Bt.prototype._getValue_toArray];Bt.prototype.SetterByBindingTypeAndVersioning=[[Bt.prototype._setValue_direct,Bt.prototype._setValue_direct_setNeedsUpdate,Bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Bt.prototype._setValue_array,Bt.prototype._setValue_array_setNeedsUpdate,Bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Bt.prototype._setValue_arrayElement,Bt.prototype._setValue_arrayElement_setNeedsUpdate,Bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Bt.prototype._setValue_fromArray,Bt.prototype._setValue_fromArray_setNeedsUpdate,Bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const cd=new mt;class Wy{constructor(e,t,i=0,r=1/0){this.ray=new Zs(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new ph,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return cd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(cd),this}intersectObject(e,t=!0,i=[]){return Ou(e,this,i,t),i.sort(ud),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Ou(e[r],this,i,t);return i.sort(ud),i}}function ud(n,e){return n.distance-e.distance}function Ou(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)Ou(s[o],e,t,!0)}}class hd{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=yt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(yt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Xy extends Wo{constructor(e=10,t=10,i=4473924,r=8947848){i=new tt(i),r=new tt(r);const s=t/2,o=e/t,a=e/2,l=[],c=[];for(let f=0,d=0,v=-a;f<=t;f++,v+=o){l.push(-a,0,v,a,0,v),l.push(v,0,-a,v,0,a);const x=f===s?i:r;x.toArray(c,d),d+=3,x.toArray(c,d),d+=3,x.toArray(c,d),d+=3,x.toArray(c,d),d+=3}const u=new sn;u.setAttribute("position",new Zt(l,3)),u.setAttribute("color",new Zt(c,3));const h=new Qr({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class jy extends Wo{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new sn;r.setAttribute("position",new Zt(t,3)),r.setAttribute("color",new Zt(i,3));const s=new Qr({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,t,i){const r=new tt,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(t),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class $y extends rs{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function fd(n,e,t,i){const r=qy(i);switch(t){case Sm:return n*e;case Em:return n*e;case Tm:return n*e*2;case lh:return n*e/r.components*r.byteLength;case ch:return n*e/r.components*r.byteLength;case Am:return n*e*2/r.components*r.byteLength;case uh:return n*e*2/r.components*r.byteLength;case bm:return n*e*3/r.components*r.byteLength;case Zn:return n*e*4/r.components*r.byteLength;case hh:return n*e*4/r.components*r.byteLength;case Xa:case ja:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $a:case qa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case au:case cu:return Math.max(n,16)*Math.max(e,8)/4;case ou:case lu:return Math.max(n,8)*Math.max(e,8)/2;case uu:case hu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case fu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case du:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case pu:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case mu:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case gu:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case _u:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case vu:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case xu:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case yu:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Mu:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Su:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case bu:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Eu:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Tu:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Au:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ya:case wu:case Ru:return Math.ceil(n/4)*Math.ceil(e/4)*16;case wm:case Cu:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pu:case Lu:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function qy(n){switch(n){case rr:case xm:return{byteLength:1,components:1};case ko:case ym:case qo:return{byteLength:2,components:1};case oh:case ah:return{byteLength:2,components:4};case es:case sh:case li:return{byteLength:4,components:1};case Mm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ih}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ih);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Xm(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Yy(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((d,v)=>d.start-v.start);let f=0;for(let d=1;d<h.length;d++){const v=h[f],x=h[d];x.start<=v.start+v.count+1?v.count=Math.max(v.count,x.start+x.count-v.start):(++f,h[f]=x)}h.length=f+1;for(let d=0,v=h.length;d<v;d++){const x=h[d];n.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var Ky=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zy=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Jy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,eM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,tM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,nM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,iM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,sM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,oM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,aM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,cM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,uM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,fM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,dM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,mM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,gM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_M=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,xM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,yM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,MM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,SM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,bM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,EM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,TM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,AM="gl_FragColor = linearToOutputTexel( gl_FragColor );",wM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,RM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,CM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,PM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,LM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,IM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,DM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,UM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,NM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,FM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,OM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,BM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,VM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,kM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,HM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,GM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,WM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,XM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$M=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,qM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,YM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,KM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ZM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,JM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,QM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,eS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,nS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,iS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,sS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,oS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,aS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,uS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,fS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,pS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,mS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_S=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,yS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,MS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,SS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,bS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ES=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,TS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,AS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,RS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,CS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,PS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,LS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,IS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,DS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,US=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,NS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,FS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,OS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,BS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,VS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,HS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,GS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,WS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,XS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$S=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const YS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,KS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ZS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,JS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,QS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,nb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ib=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,rb=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,sb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ob=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ab=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ub=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,db=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,pb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,gb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,_b=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,yb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Eb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Tb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ab=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,wb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vt={alphahash_fragment:Ky,alphahash_pars_fragment:Zy,alphamap_fragment:Jy,alphamap_pars_fragment:Qy,alphatest_fragment:eM,alphatest_pars_fragment:tM,aomap_fragment:nM,aomap_pars_fragment:iM,batching_pars_vertex:rM,batching_vertex:sM,begin_vertex:oM,beginnormal_vertex:aM,bsdfs:lM,iridescence_fragment:cM,bumpmap_pars_fragment:uM,clipping_planes_fragment:hM,clipping_planes_pars_fragment:fM,clipping_planes_pars_vertex:dM,clipping_planes_vertex:pM,color_fragment:mM,color_pars_fragment:gM,color_pars_vertex:_M,color_vertex:vM,common:xM,cube_uv_reflection_fragment:yM,defaultnormal_vertex:MM,displacementmap_pars_vertex:SM,displacementmap_vertex:bM,emissivemap_fragment:EM,emissivemap_pars_fragment:TM,colorspace_fragment:AM,colorspace_pars_fragment:wM,envmap_fragment:RM,envmap_common_pars_fragment:CM,envmap_pars_fragment:PM,envmap_pars_vertex:LM,envmap_physical_pars_fragment:HM,envmap_vertex:IM,fog_vertex:DM,fog_pars_vertex:UM,fog_fragment:NM,fog_pars_fragment:FM,gradientmap_pars_fragment:OM,lightmap_pars_fragment:BM,lights_lambert_fragment:VM,lights_lambert_pars_fragment:kM,lights_pars_begin:zM,lights_toon_fragment:GM,lights_toon_pars_fragment:WM,lights_phong_fragment:XM,lights_phong_pars_fragment:jM,lights_physical_fragment:$M,lights_physical_pars_fragment:qM,lights_fragment_begin:YM,lights_fragment_maps:KM,lights_fragment_end:ZM,logdepthbuf_fragment:JM,logdepthbuf_pars_fragment:QM,logdepthbuf_pars_vertex:eS,logdepthbuf_vertex:tS,map_fragment:nS,map_pars_fragment:iS,map_particle_fragment:rS,map_particle_pars_fragment:sS,metalnessmap_fragment:oS,metalnessmap_pars_fragment:aS,morphinstance_vertex:lS,morphcolor_vertex:cS,morphnormal_vertex:uS,morphtarget_pars_vertex:hS,morphtarget_vertex:fS,normal_fragment_begin:dS,normal_fragment_maps:pS,normal_pars_fragment:mS,normal_pars_vertex:gS,normal_vertex:_S,normalmap_pars_fragment:vS,clearcoat_normal_fragment_begin:xS,clearcoat_normal_fragment_maps:yS,clearcoat_pars_fragment:MS,iridescence_pars_fragment:SS,opaque_fragment:bS,packing:ES,premultiplied_alpha_fragment:TS,project_vertex:AS,dithering_fragment:wS,dithering_pars_fragment:RS,roughnessmap_fragment:CS,roughnessmap_pars_fragment:PS,shadowmap_pars_fragment:LS,shadowmap_pars_vertex:IS,shadowmap_vertex:DS,shadowmask_pars_fragment:US,skinbase_vertex:NS,skinning_pars_vertex:FS,skinning_vertex:OS,skinnormal_vertex:BS,specularmap_fragment:VS,specularmap_pars_fragment:kS,tonemapping_fragment:zS,tonemapping_pars_fragment:HS,transmission_fragment:GS,transmission_pars_fragment:WS,uv_pars_fragment:XS,uv_pars_vertex:jS,uv_vertex:$S,worldpos_vertex:qS,background_vert:YS,background_frag:KS,backgroundCube_vert:ZS,backgroundCube_frag:JS,cube_vert:QS,cube_frag:eb,depth_vert:tb,depth_frag:nb,distanceRGBA_vert:ib,distanceRGBA_frag:rb,equirect_vert:sb,equirect_frag:ob,linedashed_vert:ab,linedashed_frag:lb,meshbasic_vert:cb,meshbasic_frag:ub,meshlambert_vert:hb,meshlambert_frag:fb,meshmatcap_vert:db,meshmatcap_frag:pb,meshnormal_vert:mb,meshnormal_frag:gb,meshphong_vert:_b,meshphong_frag:vb,meshphysical_vert:xb,meshphysical_frag:yb,meshtoon_vert:Mb,meshtoon_frag:Sb,points_vert:bb,points_frag:Eb,shadow_vert:Tb,shadow_frag:Ab,sprite_vert:wb,sprite_frag:Rb},Ve={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new gt}},envmap:{envMap:{value:null},envMapRotation:{value:new gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new gt},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0},uvTransform:{value:new gt}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}}},bi={basic:{uniforms:Cn([Ve.common,Ve.specularmap,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:Cn([Ve.common,Ve.specularmap,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.fog,Ve.lights,{emissive:{value:new tt(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:Cn([Ve.common,Ve.specularmap,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.fog,Ve.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:Cn([Ve.common,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.roughnessmap,Ve.metalnessmap,Ve.fog,Ve.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:Cn([Ve.common,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.gradientmap,Ve.fog,Ve.lights,{emissive:{value:new tt(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:Cn([Ve.common,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:Cn([Ve.points,Ve.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:Cn([Ve.common,Ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:Cn([Ve.common,Ve.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:Cn([Ve.common,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:Cn([Ve.sprite,Ve.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new gt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:Cn([Ve.common,Ve.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:Cn([Ve.lights,Ve.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};bi.physical={uniforms:Cn([bi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new gt},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new gt},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new gt},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new gt},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new gt},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new gt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const Na={r:0,b:0,g:0},Vr=new mi,Cb=new mt;function Pb(n,e,t,i,r,s,o){const a=new tt(0);let l=s===!0?0:1,c,u,h=null,f=0,d=null;function v(R){let M=R.isScene===!0?R.background:null;return M&&M.isTexture&&(M=(R.backgroundBlurriness>0?t:e).get(M)),M}function x(R){let M=!1;const F=v(R);F===null?p(a,l):F&&F.isColor&&(p(F,1),M=!0);const I=n.xr.getEnvironmentBlendMode();I==="additive"?i.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(R,M){const F=v(M);F&&(F.isCubeTexture||F.mapping===El)?(u===void 0&&(u=new cn(new Yo(1,1,1),new Tr({name:"BackgroundCubeMaterial",uniforms:Xs(bi.backgroundCube.uniforms),vertexShader:bi.backgroundCube.vertexShader,fragmentShader:bi.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(I,U,W){this.matrixWorld.copyPosition(W.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Vr.copy(M.backgroundRotation),Vr.x*=-1,Vr.y*=-1,Vr.z*=-1,F.isCubeTexture&&F.isRenderTargetTexture===!1&&(Vr.y*=-1,Vr.z*=-1),u.material.uniforms.envMap.value=F,u.material.uniforms.flipEnvMap.value=F.isCubeTexture&&F.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Cb.makeRotationFromEuler(Vr)),u.material.toneMapped=Rt.getTransfer(F.colorSpace)!==Vt,(h!==F||f!==F.version||d!==n.toneMapping)&&(u.material.needsUpdate=!0,h=F,f=F.version,d=n.toneMapping),u.layers.enableAll(),R.unshift(u,u.geometry,u.material,0,0,null)):F&&F.isTexture&&(c===void 0&&(c=new cn(new Ko(2,2),new Tr({name:"BackgroundMaterial",uniforms:Xs(bi.background.uniforms),vertexShader:bi.background.vertexShader,fragmentShader:bi.background.fragmentShader,side:Di,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=F,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Rt.getTransfer(F.colorSpace)!==Vt,F.matrixAutoUpdate===!0&&F.updateMatrix(),c.material.uniforms.uvTransform.value.copy(F.matrix),(h!==F||f!==F.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=F,f=F.version,d=n.toneMapping),c.layers.enableAll(),R.unshift(c,c.geometry,c.material,0,0,null))}function p(R,M){R.getRGB(Na,Om(n)),i.buffers.color.setClear(Na.r,Na.g,Na.b,M,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(R,M=1){a.set(R),l=M,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(R){l=R,p(a,l)},render:x,addToRenderList:_,dispose:A}}function Lb(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(E,B,ue,ne,de){let be=!1;const H=h(ne,ue,B);s!==H&&(s=H,c(s.object)),be=d(E,ne,ue,de),be&&v(E,ne,ue,de),de!==null&&e.update(de,n.ELEMENT_ARRAY_BUFFER),(be||o)&&(o=!1,M(E,B,ue,ne),de!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(de).buffer))}function l(){return n.createVertexArray()}function c(E){return n.bindVertexArray(E)}function u(E){return n.deleteVertexArray(E)}function h(E,B,ue){const ne=ue.wireframe===!0;let de=i[E.id];de===void 0&&(de={},i[E.id]=de);let be=de[B.id];be===void 0&&(be={},de[B.id]=be);let H=be[ne];return H===void 0&&(H=f(l()),be[ne]=H),H}function f(E){const B=[],ue=[],ne=[];for(let de=0;de<t;de++)B[de]=0,ue[de]=0,ne[de]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:ue,attributeDivisors:ne,object:E,attributes:{},index:null}}function d(E,B,ue,ne){const de=s.attributes,be=B.attributes;let H=0;const Q=ue.getAttributes();for(const z in Q)if(Q[z].location>=0){const Ae=de[z];let ke=be[z];if(ke===void 0&&(z==="instanceMatrix"&&E.instanceMatrix&&(ke=E.instanceMatrix),z==="instanceColor"&&E.instanceColor&&(ke=E.instanceColor)),Ae===void 0||Ae.attribute!==ke||ke&&Ae.data!==ke.data)return!0;H++}return s.attributesNum!==H||s.index!==ne}function v(E,B,ue,ne){const de={},be=B.attributes;let H=0;const Q=ue.getAttributes();for(const z in Q)if(Q[z].location>=0){let Ae=be[z];Ae===void 0&&(z==="instanceMatrix"&&E.instanceMatrix&&(Ae=E.instanceMatrix),z==="instanceColor"&&E.instanceColor&&(Ae=E.instanceColor));const ke={};ke.attribute=Ae,Ae&&Ae.data&&(ke.data=Ae.data),de[z]=ke,H++}s.attributes=de,s.attributesNum=H,s.index=ne}function x(){const E=s.newAttributes;for(let B=0,ue=E.length;B<ue;B++)E[B]=0}function _(E){p(E,0)}function p(E,B){const ue=s.newAttributes,ne=s.enabledAttributes,de=s.attributeDivisors;ue[E]=1,ne[E]===0&&(n.enableVertexAttribArray(E),ne[E]=1),de[E]!==B&&(n.vertexAttribDivisor(E,B),de[E]=B)}function A(){const E=s.newAttributes,B=s.enabledAttributes;for(let ue=0,ne=B.length;ue<ne;ue++)B[ue]!==E[ue]&&(n.disableVertexAttribArray(ue),B[ue]=0)}function R(E,B,ue,ne,de,be,H){H===!0?n.vertexAttribIPointer(E,B,ue,de,be):n.vertexAttribPointer(E,B,ue,ne,de,be)}function M(E,B,ue,ne){x();const de=ne.attributes,be=ue.getAttributes(),H=B.defaultAttributeValues;for(const Q in be){const z=be[Q];if(z.location>=0){let ge=de[Q];if(ge===void 0&&(Q==="instanceMatrix"&&E.instanceMatrix&&(ge=E.instanceMatrix),Q==="instanceColor"&&E.instanceColor&&(ge=E.instanceColor)),ge!==void 0){const Ae=ge.normalized,ke=ge.itemSize,Ze=e.get(ge);if(Ze===void 0)continue;const Mt=Ze.buffer,_e=Ze.type,Le=Ze.bytesPerElement,je=_e===n.INT||_e===n.UNSIGNED_INT||ge.gpuType===sh;if(ge.isInterleavedBufferAttribute){const De=ge.data,nt=De.stride,it=ge.offset;if(De.isInstancedInterleavedBuffer){for(let _t=0;_t<z.locationSize;_t++)p(z.location+_t,De.meshPerAttribute);E.isInstancedMesh!==!0&&ne._maxInstanceCount===void 0&&(ne._maxInstanceCount=De.meshPerAttribute*De.count)}else for(let _t=0;_t<z.locationSize;_t++)_(z.location+_t);n.bindBuffer(n.ARRAY_BUFFER,Mt);for(let _t=0;_t<z.locationSize;_t++)R(z.location+_t,ke/z.locationSize,_e,Ae,nt*Le,(it+ke/z.locationSize*_t)*Le,je)}else{if(ge.isInstancedBufferAttribute){for(let De=0;De<z.locationSize;De++)p(z.location+De,ge.meshPerAttribute);E.isInstancedMesh!==!0&&ne._maxInstanceCount===void 0&&(ne._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let De=0;De<z.locationSize;De++)_(z.location+De);n.bindBuffer(n.ARRAY_BUFFER,Mt);for(let De=0;De<z.locationSize;De++)R(z.location+De,ke/z.locationSize,_e,Ae,ke*Le,ke/z.locationSize*De*Le,je)}}else if(H!==void 0){const Ae=H[Q];if(Ae!==void 0)switch(Ae.length){case 2:n.vertexAttrib2fv(z.location,Ae);break;case 3:n.vertexAttrib3fv(z.location,Ae);break;case 4:n.vertexAttrib4fv(z.location,Ae);break;default:n.vertexAttrib1fv(z.location,Ae)}}}}A()}function F(){W();for(const E in i){const B=i[E];for(const ue in B){const ne=B[ue];for(const de in ne)u(ne[de].object),delete ne[de];delete B[ue]}delete i[E]}}function I(E){if(i[E.id]===void 0)return;const B=i[E.id];for(const ue in B){const ne=B[ue];for(const de in ne)u(ne[de].object),delete ne[de];delete B[ue]}delete i[E.id]}function U(E){for(const B in i){const ue=i[B];if(ue[E.id]===void 0)continue;const ne=ue[E.id];for(const de in ne)u(ne[de].object),delete ne[de];delete ue[E.id]}}function W(){w(),o=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:W,resetDefaultState:w,dispose:F,releaseStatesOfGeometry:I,releaseStatesOfProgram:U,initAttributes:x,enableAttribute:_,disableUnusedAttributes:A}}function Ib(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let d=0;for(let v=0;v<h;v++)d+=u[v];t.update(d,i,1)}function l(c,u,h,f){if(h===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let v=0;v<c.length;v++)o(c[v],u[v],f[v]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,h);let v=0;for(let x=0;x<h;x++)v+=u[x]*f[x];t.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Db(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(U){return!(U!==Zn&&i.convert(U)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(U){const W=U===qo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==rr&&i.convert(U)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==li&&!W)}function l(U){if(U==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),R=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),F=v>0,I=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:v,maxTextureSize:x,maxCubemapSize:_,maxAttributes:p,maxVertexUniforms:A,maxVaryings:R,maxFragmentUniforms:M,vertexTextures:F,maxSamples:I}}function Ub(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Si,a=new gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||i!==0||r;return r=f,i=h.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){const v=h.clippingPlanes,x=h.clipIntersection,_=h.clipShadows,p=n.get(h);if(!r||v===null||v.length===0||s&&!_)s?u(null):c();else{const A=s?0:i,R=A*4;let M=p.clippingState||null;l.value=M,M=u(v,f,R,d);for(let F=0;F!==R;++F)M[F]=t[F];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,v){const x=h!==null?h.length:0;let _=null;if(x!==0){if(_=l.value,v!==!0||_===null){const p=d+x*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(_===null||_.length<p)&&(_=new Float32Array(p));for(let R=0,M=d;R!==x;++R,M+=4)o.copy(h[R]).applyMatrix4(A,a),o.normal.toArray(_,M),_[M+3]=o.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,_}}function Nb(n){let e=new WeakMap;function t(o,a){return a===ru?o.mapping=Vs:a===su&&(o.mapping=ks),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===ru||a===su)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Qx(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Cs=4,dd=[.125,.215,.35,.446,.526,.582],jr=20,Ec=new Mh,pd=new tt;let Tc=null,Ac=0,wc=0,Rc=!1;const Gr=(1+Math.sqrt(5))/2,Es=1/Gr,md=[new k(-Gr,Es,0),new k(Gr,Es,0),new k(-Es,0,Gr),new k(Es,0,Gr),new k(0,Gr,-Es),new k(0,Gr,Es),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)];class gd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Tc=this._renderer.getRenderTarget(),Ac=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Tc,Ac,wc),this._renderer.xr.enabled=Rc,e.scissorTest=!1,Fa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Vs||e.mapping===ks?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Tc=this._renderer.getRenderTarget(),Ac=this._renderer.getActiveCubeFace(),wc=this._renderer.getActiveMipmapLevel(),Rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Hn,minFilter:Hn,generateMipmaps:!1,type:qo,format:Zn,colorSpace:Nn,depthBuffer:!1},r=_d(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_d(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Fb(s)),this._blurMaterial=Ob(s,e,t)}return r}_compileMaterial(e){const t=new cn(this._lodPlanes[0],e);this._renderer.compile(t,Ec)}_sceneToCubeUV(e,t,i,r){const a=new In(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(pd),u.toneMapping=br,u.autoClear=!1;const d=new Ti({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),v=new cn(new Yo,d);let x=!1;const _=e.background;_?_.isColor&&(d.color.copy(_),e.background=null,x=!0):(d.color.copy(pd),x=!0);for(let p=0;p<6;p++){const A=p%3;A===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):A===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const R=this._cubeSize;Fa(r,A*R,p>2?R:0,R,R),u.setRenderTarget(r),x&&u.render(v,a),u.render(e,a)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=_}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Vs||e.mapping===ks;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=xd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vd());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new cn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Fa(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Ec)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=md[(r-s-1)%md.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new cn(this._lodPlanes[r],c),f=c.uniforms,d=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*jr-1),x=s/v,_=isFinite(s)?1+Math.floor(u*x):jr;_>jr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${jr}`);const p=[];let A=0;for(let U=0;U<jr;++U){const W=U/x,w=Math.exp(-W*W/2);p.push(w),U===0?A+=w:U<_&&(A+=2*w)}for(let U=0;U<p.length;U++)p[U]=p[U]/A;f.envMap.value=e.texture,f.samples.value=_,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:R}=this;f.dTheta.value=v,f.mipInt.value=R-i;const M=this._sizeLods[r],F=3*M*(r>R-Cs?r-R+Cs:0),I=4*(this._cubeSize-M);Fa(t,F,I,3*M,2*M),l.setRenderTarget(t),l.render(h,Ec)}}function Fb(n){const e=[],t=[],i=[];let r=n;const s=n-Cs+1+dd.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-Cs?l=dd[o-n+Cs-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,v=6,x=3,_=2,p=1,A=new Float32Array(x*v*d),R=new Float32Array(_*v*d),M=new Float32Array(p*v*d);for(let I=0;I<d;I++){const U=I%3*2/3-1,W=I>2?0:-1,w=[U,W,0,U+2/3,W,0,U+2/3,W+1,0,U,W,0,U+2/3,W+1,0,U,W+1,0];A.set(w,x*v*I),R.set(f,_*v*I);const E=[I,I,I,I,I,I];M.set(E,p*v*I)}const F=new sn;F.setAttribute("position",new Jt(A,x)),F.setAttribute("uv",new Jt(R,_)),F.setAttribute("faceIndex",new Jt(M,p)),e.push(F),r>Cs&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function _d(n,e,t){const i=new ts(n,e,t);return i.texture.mapping=El,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fa(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Ob(n,e,t){const i=new Float32Array(jr),r=new k(0,1,0);return new Tr({name:"SphericalGaussianBlur",defines:{n:jr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function vd(){return new Tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function xd(){return new Tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function Eh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Bb(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===ru||l===su,u=l===Vs||l===ks;if(c||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new gd(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const d=a.image;return c&&d&&d.height>0||u&&d&&r(d)?(t===null&&(t=new gd(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Vb(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&As("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function kb(n,e,t,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);f.removeEventListener("dispose",o),delete r[f.id];const d=s.get(f);d&&(e.remove(d),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const d in f)e.update(f[d],n.ARRAY_BUFFER)}function c(h){const f=[],d=h.index,v=h.attributes.position;let x=0;if(d!==null){const A=d.array;x=d.version;for(let R=0,M=A.length;R<M;R+=3){const F=A[R+0],I=A[R+1],U=A[R+2];f.push(F,I,I,U,U,F)}}else if(v!==void 0){const A=v.array;x=v.version;for(let R=0,M=A.length/3-1;R<M;R+=3){const F=R+0,I=R+1,U=R+2;f.push(F,I,I,U,U,F)}}else return;const _=new(Lm(f)?Fm:Nm)(f,1);_.version=x;const p=s.get(h);p&&e.remove(p),s.set(h,_)}function u(h){const f=s.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function zb(n,e,t){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,d){n.drawElements(i,d,s,f*o),t.update(d,i,1)}function c(f,d,v){v!==0&&(n.drawElementsInstanced(i,d,s,f*o,v),t.update(d,i,v))}function u(f,d,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,f,0,v);let _=0;for(let p=0;p<v;p++)_+=d[p];t.update(_,i,1)}function h(f,d,v,x){if(v===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let p=0;p<f.length;p++)c(f[p]/o,d[p],x[p]);else{_.multiDrawElementsInstancedWEBGL(i,d,0,s,f,0,x,0,v);let p=0;for(let A=0;A<v;A++)p+=d[A]*x[A];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Hb(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Gb(n,e,t){const i=new WeakMap,r=new Ut;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let w=function(){U.dispose(),i.delete(a),a.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],A=a.morphAttributes.color||[];let R=0;d===!0&&(R=1),v===!0&&(R=2),x===!0&&(R=3);let M=a.attributes.position.count*R,F=1;M>e.maxTextureSize&&(F=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const I=new Float32Array(M*F*4*h),U=new Dm(I,M,F,h);U.type=li,U.needsUpdate=!0;const W=R*4;for(let E=0;E<h;E++){const B=_[E],ue=p[E],ne=A[E],de=M*F*4*E;for(let be=0;be<B.count;be++){const H=be*W;d===!0&&(r.fromBufferAttribute(B,be),I[de+H+0]=r.x,I[de+H+1]=r.y,I[de+H+2]=r.z,I[de+H+3]=0),v===!0&&(r.fromBufferAttribute(ue,be),I[de+H+4]=r.x,I[de+H+5]=r.y,I[de+H+6]=r.z,I[de+H+7]=0),x===!0&&(r.fromBufferAttribute(ne,be),I[de+H+8]=r.x,I[de+H+9]=r.y,I[de+H+10]=r.z,I[de+H+11]=ne.itemSize===4?r.w:1)}}f={count:h,texture:U,size:new lt(M,F)},i.set(a,f),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];const v=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function Wb(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const jm=new mn,yd=new Hm(1,1),$m=new Dm,qm=new Ox,Ym=new Vm,Md=[],Sd=[],bd=new Float32Array(16),Ed=new Float32Array(9),Td=new Float32Array(4);function eo(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Md[r];if(s===void 0&&(s=new Float32Array(r),Md[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function hn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function fn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Rl(n,e){let t=Sd[e];t===void 0&&(t=new Int32Array(e),Sd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Xb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function jb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;n.uniform2fv(this.addr,e),fn(t,e)}}function $b(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(hn(t,e))return;n.uniform3fv(this.addr,e),fn(t,e)}}function qb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;n.uniform4fv(this.addr,e),fn(t,e)}}function Yb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(hn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),fn(t,e)}else{if(hn(t,i))return;Td.set(i),n.uniformMatrix2fv(this.addr,!1,Td),fn(t,i)}}function Kb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(hn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),fn(t,e)}else{if(hn(t,i))return;Ed.set(i),n.uniformMatrix3fv(this.addr,!1,Ed),fn(t,i)}}function Zb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(hn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),fn(t,e)}else{if(hn(t,i))return;bd.set(i),n.uniformMatrix4fv(this.addr,!1,bd),fn(t,i)}}function Jb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Qb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;n.uniform2iv(this.addr,e),fn(t,e)}}function eE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(hn(t,e))return;n.uniform3iv(this.addr,e),fn(t,e)}}function tE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;n.uniform4iv(this.addr,e),fn(t,e)}}function nE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function iE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(hn(t,e))return;n.uniform2uiv(this.addr,e),fn(t,e)}}function rE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(hn(t,e))return;n.uniform3uiv(this.addr,e),fn(t,e)}}function sE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(hn(t,e))return;n.uniform4uiv(this.addr,e),fn(t,e)}}function oE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(yd.compareFunction=Cm,s=yd):s=jm,t.setTexture2D(e||s,r)}function aE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||qm,r)}function lE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Ym,r)}function cE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||$m,r)}function uE(n){switch(n){case 5126:return Xb;case 35664:return jb;case 35665:return $b;case 35666:return qb;case 35674:return Yb;case 35675:return Kb;case 35676:return Zb;case 5124:case 35670:return Jb;case 35667:case 35671:return Qb;case 35668:case 35672:return eE;case 35669:case 35673:return tE;case 5125:return nE;case 36294:return iE;case 36295:return rE;case 36296:return sE;case 35678:case 36198:case 36298:case 36306:case 35682:return oE;case 35679:case 36299:case 36307:return aE;case 35680:case 36300:case 36308:case 36293:return lE;case 36289:case 36303:case 36311:case 36292:return cE}}function hE(n,e){n.uniform1fv(this.addr,e)}function fE(n,e){const t=eo(e,this.size,2);n.uniform2fv(this.addr,t)}function dE(n,e){const t=eo(e,this.size,3);n.uniform3fv(this.addr,t)}function pE(n,e){const t=eo(e,this.size,4);n.uniform4fv(this.addr,t)}function mE(n,e){const t=eo(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function gE(n,e){const t=eo(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function _E(n,e){const t=eo(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function vE(n,e){n.uniform1iv(this.addr,e)}function xE(n,e){n.uniform2iv(this.addr,e)}function yE(n,e){n.uniform3iv(this.addr,e)}function ME(n,e){n.uniform4iv(this.addr,e)}function SE(n,e){n.uniform1uiv(this.addr,e)}function bE(n,e){n.uniform2uiv(this.addr,e)}function EE(n,e){n.uniform3uiv(this.addr,e)}function TE(n,e){n.uniform4uiv(this.addr,e)}function AE(n,e,t){const i=this.cache,r=e.length,s=Rl(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||jm,s[o])}function wE(n,e,t){const i=this.cache,r=e.length,s=Rl(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||qm,s[o])}function RE(n,e,t){const i=this.cache,r=e.length,s=Rl(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Ym,s[o])}function CE(n,e,t){const i=this.cache,r=e.length,s=Rl(t,r);hn(i,s)||(n.uniform1iv(this.addr,s),fn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||$m,s[o])}function PE(n){switch(n){case 5126:return hE;case 35664:return fE;case 35665:return dE;case 35666:return pE;case 35674:return mE;case 35675:return gE;case 35676:return _E;case 5124:case 35670:return vE;case 35667:case 35671:return xE;case 35668:case 35672:return yE;case 35669:case 35673:return ME;case 5125:return SE;case 36294:return bE;case 36295:return EE;case 36296:return TE;case 35678:case 36198:case 36298:case 36306:case 35682:return AE;case 35679:case 36299:case 36307:return wE;case 35680:case 36300:case 36308:case 36293:return RE;case 36289:case 36303:case 36311:case 36292:return CE}}class LE{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=uE(t.type)}}class IE{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=PE(t.type)}}class DE{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Cc=/(\w+)(\])?(\[|\.)?/g;function Ad(n,e){n.seq.push(e),n.map[e.id]=e}function UE(n,e,t){const i=n.name,r=i.length;for(Cc.lastIndex=0;;){const s=Cc.exec(i),o=Cc.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Ad(t,c===void 0?new LE(a,n,e):new IE(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new DE(a),Ad(t,h)),t=h}}}class Za{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);UE(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function wd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const NE=37297;let FE=0;function OE(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Rd=new gt;function BE(n){Rt._getMatrix(Rd,Rt.workingColorSpace,n);const e=`mat3( ${Rd.elements.map(t=>t.toFixed(4))} )`;switch(Rt.getTransfer(n)){case cl:return[e,"LinearTransferOETF"];case Vt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Cd(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+OE(n.getShaderSource(e),o)}else return r}function VE(n,e){const t=BE(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function kE(n,e){let t;switch(e){case jv:t="Linear";break;case $v:t="Reinhard";break;case qv:t="Cineon";break;case Yv:t="ACESFilmic";break;case Zv:t="AgX";break;case Jv:t="Neutral";break;case Kv:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Oa=new k;function zE(){Rt.getLuminanceCoefficients(Oa);const n=Oa.x.toFixed(4),e=Oa.y.toFixed(4),t=Oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function HE(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xo).join(`
`)}function GE(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function WE(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function xo(n){return n!==""}function Pd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ld(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const XE=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bu(n){return n.replace(XE,$E)}const jE=new Map;function $E(n,e){let t=vt[e];if(t===void 0){const i=jE.get(e);if(i!==void 0)t=vt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Bu(t)}const qE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Id(n){return n.replace(qE,YE)}function YE(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Dd(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function KE(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===gm?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Tv?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Yi&&(e="SHADOWMAP_TYPE_VSM"),e}function ZE(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Vs:case ks:e="ENVMAP_TYPE_CUBE";break;case El:e="ENVMAP_TYPE_CUBE_UV";break}return e}function JE(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ks:e="ENVMAP_MODE_REFRACTION";break}return e}function QE(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case rh:e="ENVMAP_BLENDING_MULTIPLY";break;case Wv:e="ENVMAP_BLENDING_MIX";break;case Xv:e="ENVMAP_BLENDING_ADD";break}return e}function eT(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function tT(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=KE(t),c=ZE(t),u=JE(t),h=QE(t),f=eT(t),d=HE(t),v=GE(s),x=r.createProgram();let _,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(xo).join(`
`),_.length>0&&(_+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(xo).join(`
`),p.length>0&&(p+=`
`)):(_=[Dd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xo).join(`
`),p=[Dd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==br?"#define TONE_MAPPING":"",t.toneMapping!==br?vt.tonemapping_pars_fragment:"",t.toneMapping!==br?kE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,VE("linearToOutputTexel",t.outputColorSpace),zE(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xo).join(`
`)),o=Bu(o),o=Pd(o,t),o=Ld(o,t),a=Bu(a),a=Pd(a,t),a=Ld(a,t),o=Id(o),a=Id(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,p=["#define varying in",t.glslVersion===Af?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Af?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const R=A+_+o,M=A+p+a,F=wd(r,r.VERTEX_SHADER,R),I=wd(r,r.FRAGMENT_SHADER,M);r.attachShader(x,F),r.attachShader(x,I),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function U(B){if(n.debug.checkShaderErrors){const ue=r.getProgramInfoLog(x).trim(),ne=r.getShaderInfoLog(F).trim(),de=r.getShaderInfoLog(I).trim();let be=!0,H=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(be=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,F,I);else{const Q=Cd(r,F,"vertex"),z=Cd(r,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+ue+`
`+Q+`
`+z)}else ue!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ue):(ne===""||de==="")&&(H=!1);H&&(B.diagnostics={runnable:be,programLog:ue,vertexShader:{log:ne,prefix:_},fragmentShader:{log:de,prefix:p}})}r.deleteShader(F),r.deleteShader(I),W=new Za(r,x),w=WE(r,x)}let W;this.getUniforms=function(){return W===void 0&&U(this),W};let w;this.getAttributes=function(){return w===void 0&&U(this),w};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=r.getProgramParameter(x,NE)),E},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=FE++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=F,this.fragmentShader=I,this}let nT=0;class iT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new rT(e),t.set(e,i)),i}}class rT{constructor(e){this.id=nT++,this.code=e,this.usedTimes=0}}function sT(n,e,t,i,r,s,o){const a=new ph,l=new iT,c=new Set,u=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let d=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function _(w,E,B,ue,ne){const de=ue.fog,be=ne.geometry,H=w.isMeshStandardMaterial?ue.environment:null,Q=(w.isMeshStandardMaterial?t:e).get(w.envMap||H),z=Q&&Q.mapping===El?Q.image.height:null,ge=v[w.type];w.precision!==null&&(d=r.getMaxPrecision(w.precision),d!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",d,"instead."));const Ae=be.morphAttributes.position||be.morphAttributes.normal||be.morphAttributes.color,ke=Ae!==void 0?Ae.length:0;let Ze=0;be.morphAttributes.position!==void 0&&(Ze=1),be.morphAttributes.normal!==void 0&&(Ze=2),be.morphAttributes.color!==void 0&&(Ze=3);let Mt,_e,Le,je;if(ge){const Pt=bi[ge];Mt=Pt.vertexShader,_e=Pt.fragmentShader}else Mt=w.vertexShader,_e=w.fragmentShader,l.update(w),Le=l.getVertexShaderID(w),je=l.getFragmentShaderID(w);const De=n.getRenderTarget(),nt=n.state.buffers.depth.getReversed(),it=ne.isInstancedMesh===!0,_t=ne.isBatchedMesh===!0,L=!!w.map,N=!!w.matcap,K=!!Q,C=!!w.aoMap,pe=!!w.lightMap,se=!!w.bumpMap,ve=!!w.normalMap,oe=!!w.displacementMap,ye=!!w.emissiveMap,Z=!!w.metalnessMap,T=!!w.roughnessMap,y=w.anisotropy>0,V=w.clearcoat>0,J=w.dispersion>0,ae=w.iridescence>0,te=w.sheen>0,we=w.transmission>0,Re=y&&!!w.anisotropyMap,Te=V&&!!w.clearcoatMap,rt=V&&!!w.clearcoatNormalMap,he=V&&!!w.clearcoatRoughnessMap,Ne=ae&&!!w.iridescenceMap,We=ae&&!!w.iridescenceThicknessMap,Ke=te&&!!w.sheenColorMap,Ue=te&&!!w.sheenRoughnessMap,xt=!!w.specularMap,ft=!!w.specularColorMap,Nt=!!w.specularIntensityMap,X=we&&!!w.transmissionMap,Fe=we&&!!w.thicknessMap,fe=!!w.gradientMap,Me=!!w.alphaMap,Oe=w.alphaTest>0,He=!!w.alphaHash,ct=!!w.extensions;let Ht=br;w.toneMapped&&(De===null||De.isXRRenderTarget===!0)&&(Ht=n.toneMapping);const on={shaderID:ge,shaderType:w.type,shaderName:w.name,vertexShader:Mt,fragmentShader:_e,defines:w.defines,customVertexShaderID:Le,customFragmentShaderID:je,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:d,batching:_t,batchingColor:_t&&ne._colorsTexture!==null,instancing:it,instancingColor:it&&ne.instanceColor!==null,instancingMorph:it&&ne.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:De===null?n.outputColorSpace:De.isXRRenderTarget===!0?De.texture.colorSpace:Nn,alphaToCoverage:!!w.alphaToCoverage,map:L,matcap:N,envMap:K,envMapMode:K&&Q.mapping,envMapCubeUVHeight:z,aoMap:C,lightMap:pe,bumpMap:se,normalMap:ve,displacementMap:f&&oe,emissiveMap:ye,normalMapObjectSpace:ve&&w.normalMapType===rx,normalMapTangentSpace:ve&&w.normalMapType===fh,metalnessMap:Z,roughnessMap:T,anisotropy:y,anisotropyMap:Re,clearcoat:V,clearcoatMap:Te,clearcoatNormalMap:rt,clearcoatRoughnessMap:he,dispersion:J,iridescence:ae,iridescenceMap:Ne,iridescenceThicknessMap:We,sheen:te,sheenColorMap:Ke,sheenRoughnessMap:Ue,specularMap:xt,specularColorMap:ft,specularIntensityMap:Nt,transmission:we,transmissionMap:X,thicknessMap:Fe,gradientMap:fe,opaque:w.transparent===!1&&w.blending===Is&&w.alphaToCoverage===!1,alphaMap:Me,alphaTest:Oe,alphaHash:He,combine:w.combine,mapUv:L&&x(w.map.channel),aoMapUv:C&&x(w.aoMap.channel),lightMapUv:pe&&x(w.lightMap.channel),bumpMapUv:se&&x(w.bumpMap.channel),normalMapUv:ve&&x(w.normalMap.channel),displacementMapUv:oe&&x(w.displacementMap.channel),emissiveMapUv:ye&&x(w.emissiveMap.channel),metalnessMapUv:Z&&x(w.metalnessMap.channel),roughnessMapUv:T&&x(w.roughnessMap.channel),anisotropyMapUv:Re&&x(w.anisotropyMap.channel),clearcoatMapUv:Te&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:rt&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ne&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:We&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ke&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:Ue&&x(w.sheenRoughnessMap.channel),specularMapUv:xt&&x(w.specularMap.channel),specularColorMapUv:ft&&x(w.specularColorMap.channel),specularIntensityMapUv:Nt&&x(w.specularIntensityMap.channel),transmissionMapUv:X&&x(w.transmissionMap.channel),thicknessMapUv:Fe&&x(w.thicknessMap.channel),alphaMapUv:Me&&x(w.alphaMap.channel),vertexTangents:!!be.attributes.tangent&&(ve||y),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!be.attributes.color&&be.attributes.color.itemSize===4,pointsUvs:ne.isPoints===!0&&!!be.attributes.uv&&(L||Me),fog:!!de,useFog:w.fog===!0,fogExp2:!!de&&de.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:nt,skinning:ne.isSkinnedMesh===!0,morphTargets:be.morphAttributes.position!==void 0,morphNormals:be.morphAttributes.normal!==void 0,morphColors:be.morphAttributes.color!==void 0,morphTargetsCount:ke,morphTextureStride:Ze,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&B.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ht,decodeVideoTexture:L&&w.map.isVideoTexture===!0&&Rt.getTransfer(w.map.colorSpace)===Vt,decodeVideoTextureEmissive:ye&&w.emissiveMap.isVideoTexture===!0&&Rt.getTransfer(w.emissiveMap.colorSpace)===Vt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Yn,flipSided:w.side===Bn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:ct&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ct&&w.extensions.multiDraw===!0||_t)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return on.vertexUv1s=c.has(1),on.vertexUv2s=c.has(2),on.vertexUv3s=c.has(3),c.clear(),on}function p(w){const E=[];if(w.shaderID?E.push(w.shaderID):(E.push(w.customVertexShaderID),E.push(w.customFragmentShaderID)),w.defines!==void 0)for(const B in w.defines)E.push(B),E.push(w.defines[B]);return w.isRawShaderMaterial===!1&&(A(E,w),R(E,w),E.push(n.outputColorSpace)),E.push(w.customProgramCacheKey),E.join()}function A(w,E){w.push(E.precision),w.push(E.outputColorSpace),w.push(E.envMapMode),w.push(E.envMapCubeUVHeight),w.push(E.mapUv),w.push(E.alphaMapUv),w.push(E.lightMapUv),w.push(E.aoMapUv),w.push(E.bumpMapUv),w.push(E.normalMapUv),w.push(E.displacementMapUv),w.push(E.emissiveMapUv),w.push(E.metalnessMapUv),w.push(E.roughnessMapUv),w.push(E.anisotropyMapUv),w.push(E.clearcoatMapUv),w.push(E.clearcoatNormalMapUv),w.push(E.clearcoatRoughnessMapUv),w.push(E.iridescenceMapUv),w.push(E.iridescenceThicknessMapUv),w.push(E.sheenColorMapUv),w.push(E.sheenRoughnessMapUv),w.push(E.specularMapUv),w.push(E.specularColorMapUv),w.push(E.specularIntensityMapUv),w.push(E.transmissionMapUv),w.push(E.thicknessMapUv),w.push(E.combine),w.push(E.fogExp2),w.push(E.sizeAttenuation),w.push(E.morphTargetsCount),w.push(E.morphAttributeCount),w.push(E.numDirLights),w.push(E.numPointLights),w.push(E.numSpotLights),w.push(E.numSpotLightMaps),w.push(E.numHemiLights),w.push(E.numRectAreaLights),w.push(E.numDirLightShadows),w.push(E.numPointLightShadows),w.push(E.numSpotLightShadows),w.push(E.numSpotLightShadowsWithMaps),w.push(E.numLightProbes),w.push(E.shadowMapType),w.push(E.toneMapping),w.push(E.numClippingPlanes),w.push(E.numClipIntersection),w.push(E.depthPacking)}function R(w,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reverseDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),w.push(a.mask)}function M(w){const E=v[w.type];let B;if(E){const ue=bi[E];B=Yx.clone(ue.uniforms)}else B=w.uniforms;return B}function F(w,E){let B;for(let ue=0,ne=u.length;ue<ne;ue++){const de=u[ue];if(de.cacheKey===E){B=de,++B.usedTimes;break}}return B===void 0&&(B=new tT(n,E,w,s),u.push(B)),B}function I(w){if(--w.usedTimes===0){const E=u.indexOf(w);u[E]=u[u.length-1],u.pop(),w.destroy()}}function U(w){l.remove(w)}function W(){l.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:M,acquireProgram:F,releaseProgram:I,releaseShaderCache:U,programs:u,dispose:W}}function oT(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function aT(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Ud(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Nd(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,f,d,v,x,_){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:d,groupOrder:v,renderOrder:h.renderOrder,z:x,group:_},n[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=d,p.groupOrder=v,p.renderOrder=h.renderOrder,p.z=x,p.group=_),e++,p}function a(h,f,d,v,x,_){const p=o(h,f,d,v,x,_);d.transmission>0?i.push(p):d.transparent===!0?r.push(p):t.push(p)}function l(h,f,d,v,x,_){const p=o(h,f,d,v,x,_);d.transmission>0?i.unshift(p):d.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,f){t.length>1&&t.sort(h||aT),i.length>1&&i.sort(f||Ud),r.length>1&&r.sort(f||Ud)}function u(){for(let h=e,f=n.length;h<f;h++){const d=n[h];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function lT(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Nd,n.set(i,[o])):r>=s.length?(o=new Nd,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function cT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new tt};break;case"SpotLight":t={position:new k,direction:new k,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new k,halfWidth:new k,halfHeight:new k};break}return n[e.id]=t,t}}}function uT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let hT=0;function fT(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function dT(n){const e=new cT,t=uT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new k);const r=new k,s=new mt,o=new mt;function a(c){let u=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let d=0,v=0,x=0,_=0,p=0,A=0,R=0,M=0,F=0,I=0,U=0;c.sort(fT);for(let w=0,E=c.length;w<E;w++){const B=c[w],ue=B.color,ne=B.intensity,de=B.distance,be=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)u+=ue.r*ne,h+=ue.g*ne,f+=ue.b*ne;else if(B.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(B.sh.coefficients[H],ne);U++}else if(B.isDirectionalLight){const H=e.get(B);if(H.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const Q=B.shadow,z=t.get(B);z.shadowIntensity=Q.intensity,z.shadowBias=Q.bias,z.shadowNormalBias=Q.normalBias,z.shadowRadius=Q.radius,z.shadowMapSize=Q.mapSize,i.directionalShadow[d]=z,i.directionalShadowMap[d]=be,i.directionalShadowMatrix[d]=B.shadow.matrix,A++}i.directional[d]=H,d++}else if(B.isSpotLight){const H=e.get(B);H.position.setFromMatrixPosition(B.matrixWorld),H.color.copy(ue).multiplyScalar(ne),H.distance=de,H.coneCos=Math.cos(B.angle),H.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),H.decay=B.decay,i.spot[x]=H;const Q=B.shadow;if(B.map&&(i.spotLightMap[F]=B.map,F++,Q.updateMatrices(B),B.castShadow&&I++),i.spotLightMatrix[x]=Q.matrix,B.castShadow){const z=t.get(B);z.shadowIntensity=Q.intensity,z.shadowBias=Q.bias,z.shadowNormalBias=Q.normalBias,z.shadowRadius=Q.radius,z.shadowMapSize=Q.mapSize,i.spotShadow[x]=z,i.spotShadowMap[x]=be,M++}x++}else if(B.isRectAreaLight){const H=e.get(B);H.color.copy(ue).multiplyScalar(ne),H.halfWidth.set(B.width*.5,0,0),H.halfHeight.set(0,B.height*.5,0),i.rectArea[_]=H,_++}else if(B.isPointLight){const H=e.get(B);if(H.color.copy(B.color).multiplyScalar(B.intensity),H.distance=B.distance,H.decay=B.decay,B.castShadow){const Q=B.shadow,z=t.get(B);z.shadowIntensity=Q.intensity,z.shadowBias=Q.bias,z.shadowNormalBias=Q.normalBias,z.shadowRadius=Q.radius,z.shadowMapSize=Q.mapSize,z.shadowCameraNear=Q.camera.near,z.shadowCameraFar=Q.camera.far,i.pointShadow[v]=z,i.pointShadowMap[v]=be,i.pointShadowMatrix[v]=B.shadow.matrix,R++}i.point[v]=H,v++}else if(B.isHemisphereLight){const H=e.get(B);H.skyColor.copy(B.color).multiplyScalar(ne),H.groundColor.copy(B.groundColor).multiplyScalar(ne),i.hemi[p]=H,p++}}_>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ve.LTC_FLOAT_1,i.rectAreaLTC2=Ve.LTC_FLOAT_2):(i.rectAreaLTC1=Ve.LTC_HALF_1,i.rectAreaLTC2=Ve.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const W=i.hash;(W.directionalLength!==d||W.pointLength!==v||W.spotLength!==x||W.rectAreaLength!==_||W.hemiLength!==p||W.numDirectionalShadows!==A||W.numPointShadows!==R||W.numSpotShadows!==M||W.numSpotMaps!==F||W.numLightProbes!==U)&&(i.directional.length=d,i.spot.length=x,i.rectArea.length=_,i.point.length=v,i.hemi.length=p,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=R,i.pointShadowMap.length=R,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=R,i.spotLightMatrix.length=M+F-I,i.spotLightMap.length=F,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=U,W.directionalLength=d,W.pointLength=v,W.spotLength=x,W.rectAreaLength=_,W.hemiLength=p,W.numDirectionalShadows=A,W.numPointShadows=R,W.numSpotShadows=M,W.numSpotMaps=F,W.numLightProbes=U,i.version=hT++)}function l(c,u){let h=0,f=0,d=0,v=0,x=0;const _=u.matrixWorldInverse;for(let p=0,A=c.length;p<A;p++){const R=c[p];if(R.isDirectionalLight){const M=i.directional[h];M.direction.setFromMatrixPosition(R.matrixWorld),r.setFromMatrixPosition(R.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(_),h++}else if(R.isSpotLight){const M=i.spot[d];M.position.setFromMatrixPosition(R.matrixWorld),M.position.applyMatrix4(_),M.direction.setFromMatrixPosition(R.matrixWorld),r.setFromMatrixPosition(R.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(_),d++}else if(R.isRectAreaLight){const M=i.rectArea[v];M.position.setFromMatrixPosition(R.matrixWorld),M.position.applyMatrix4(_),o.identity(),s.copy(R.matrixWorld),s.premultiply(_),o.extractRotation(s),M.halfWidth.set(R.width*.5,0,0),M.halfHeight.set(0,R.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),v++}else if(R.isPointLight){const M=i.point[f];M.position.setFromMatrixPosition(R.matrixWorld),M.position.applyMatrix4(_),f++}else if(R.isHemisphereLight){const M=i.hemi[x];M.direction.setFromMatrixPosition(R.matrixWorld),M.direction.transformDirection(_),x++}}}return{setup:a,setupView:l,state:i}}function Fd(n){const e=new dT(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function pT(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Fd(n),e.set(r,[a])):s>=o.length?(a=new Fd(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const mT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function _T(n,e,t){let i=new _h;const r=new lt,s=new lt,o=new Ut,a=new hy({depthPacking:ix}),l=new fy,c={},u=t.maxTextureSize,h={[Di]:Bn,[Bn]:Di,[Yn]:Yn},f=new Tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:mT,fragmentShader:gT}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const v=new sn;v.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new cn(v,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gm;let p=this.type;this.render=function(I,U,W){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||I.length===0)return;const w=n.getRenderTarget(),E=n.getActiveCubeFace(),B=n.getActiveMipmapLevel(),ue=n.state;ue.setBlending(Sr),ue.buffers.color.setClear(1,1,1,1),ue.buffers.depth.setTest(!0),ue.setScissorTest(!1);const ne=p!==Yi&&this.type===Yi,de=p===Yi&&this.type!==Yi;for(let be=0,H=I.length;be<H;be++){const Q=I[be],z=Q.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const ge=z.getFrameExtents();if(r.multiply(ge),s.copy(z.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ge.x),r.x=s.x*ge.x,z.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ge.y),r.y=s.y*ge.y,z.mapSize.y=s.y)),z.map===null||ne===!0||de===!0){const ke=this.type!==Yi?{minFilter:Un,magFilter:Un}:{};z.map!==null&&z.map.dispose(),z.map=new ts(r.x,r.y,ke),z.map.texture.name=Q.name+".shadowMap",z.camera.updateProjectionMatrix()}n.setRenderTarget(z.map),n.clear();const Ae=z.getViewportCount();for(let ke=0;ke<Ae;ke++){const Ze=z.getViewport(ke);o.set(s.x*Ze.x,s.y*Ze.y,s.x*Ze.z,s.y*Ze.w),ue.viewport(o),z.updateMatrices(Q,ke),i=z.getFrustum(),M(U,W,z.camera,Q,this.type)}z.isPointLightShadow!==!0&&this.type===Yi&&A(z,W),z.needsUpdate=!1}p=this.type,_.needsUpdate=!1,n.setRenderTarget(w,E,B)};function A(I,U){const W=e.update(x);f.defines.VSM_SAMPLES!==I.blurSamples&&(f.defines.VSM_SAMPLES=I.blurSamples,d.defines.VSM_SAMPLES=I.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new ts(r.x,r.y)),f.uniforms.shadow_pass.value=I.map.texture,f.uniforms.resolution.value=I.mapSize,f.uniforms.radius.value=I.radius,n.setRenderTarget(I.mapPass),n.clear(),n.renderBufferDirect(U,null,W,f,x,null),d.uniforms.shadow_pass.value=I.mapPass.texture,d.uniforms.resolution.value=I.mapSize,d.uniforms.radius.value=I.radius,n.setRenderTarget(I.map),n.clear(),n.renderBufferDirect(U,null,W,d,x,null)}function R(I,U,W,w){let E=null;const B=W.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(B!==void 0)E=B;else if(E=W.isPointLight===!0?l:a,n.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0){const ue=E.uuid,ne=U.uuid;let de=c[ue];de===void 0&&(de={},c[ue]=de);let be=de[ne];be===void 0&&(be=E.clone(),de[ne]=be,U.addEventListener("dispose",F)),E=be}if(E.visible=U.visible,E.wireframe=U.wireframe,w===Yi?E.side=U.shadowSide!==null?U.shadowSide:U.side:E.side=U.shadowSide!==null?U.shadowSide:h[U.side],E.alphaMap=U.alphaMap,E.alphaTest=U.alphaTest,E.map=U.map,E.clipShadows=U.clipShadows,E.clippingPlanes=U.clippingPlanes,E.clipIntersection=U.clipIntersection,E.displacementMap=U.displacementMap,E.displacementScale=U.displacementScale,E.displacementBias=U.displacementBias,E.wireframeLinewidth=U.wireframeLinewidth,E.linewidth=U.linewidth,W.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const ue=n.properties.get(E);ue.light=W}return E}function M(I,U,W,w,E){if(I.visible===!1)return;if(I.layers.test(U.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&E===Yi)&&(!I.frustumCulled||i.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,I.matrixWorld);const ne=e.update(I),de=I.material;if(Array.isArray(de)){const be=ne.groups;for(let H=0,Q=be.length;H<Q;H++){const z=be[H],ge=de[z.materialIndex];if(ge&&ge.visible){const Ae=R(I,ge,w,E);I.onBeforeShadow(n,I,U,W,ne,Ae,z),n.renderBufferDirect(W,null,ne,Ae,I,z),I.onAfterShadow(n,I,U,W,ne,Ae,z)}}}else if(de.visible){const be=R(I,de,w,E);I.onBeforeShadow(n,I,U,W,ne,be,null),n.renderBufferDirect(W,null,ne,be,I,null),I.onAfterShadow(n,I,U,W,ne,be,null)}}const ue=I.children;for(let ne=0,de=ue.length;ne<de;ne++)M(ue[ne],U,W,w,E)}function F(I){I.target.removeEventListener("dispose",F);for(const W in c){const w=c[W],E=I.target.uuid;E in w&&(w[E].dispose(),delete w[E])}}}const vT={[Zc]:Jc,[Qc]:nu,[eu]:iu,[Bs]:tu,[Jc]:Zc,[nu]:Qc,[iu]:eu,[tu]:Bs};function xT(n,e){function t(){let X=!1;const Fe=new Ut;let fe=null;const Me=new Ut(0,0,0,0);return{setMask:function(Oe){fe!==Oe&&!X&&(n.colorMask(Oe,Oe,Oe,Oe),fe=Oe)},setLocked:function(Oe){X=Oe},setClear:function(Oe,He,ct,Ht,on){on===!0&&(Oe*=Ht,He*=Ht,ct*=Ht),Fe.set(Oe,He,ct,Ht),Me.equals(Fe)===!1&&(n.clearColor(Oe,He,ct,Ht),Me.copy(Fe))},reset:function(){X=!1,fe=null,Me.set(-1,0,0,0)}}}function i(){let X=!1,Fe=!1,fe=null,Me=null,Oe=null;return{setReversed:function(He){if(Fe!==He){const ct=e.get("EXT_clip_control");Fe?ct.clipControlEXT(ct.LOWER_LEFT_EXT,ct.ZERO_TO_ONE_EXT):ct.clipControlEXT(ct.LOWER_LEFT_EXT,ct.NEGATIVE_ONE_TO_ONE_EXT);const Ht=Oe;Oe=null,this.setClear(Ht)}Fe=He},getReversed:function(){return Fe},setTest:function(He){He?De(n.DEPTH_TEST):nt(n.DEPTH_TEST)},setMask:function(He){fe!==He&&!X&&(n.depthMask(He),fe=He)},setFunc:function(He){if(Fe&&(He=vT[He]),Me!==He){switch(He){case Zc:n.depthFunc(n.NEVER);break;case Jc:n.depthFunc(n.ALWAYS);break;case Qc:n.depthFunc(n.LESS);break;case Bs:n.depthFunc(n.LEQUAL);break;case eu:n.depthFunc(n.EQUAL);break;case tu:n.depthFunc(n.GEQUAL);break;case nu:n.depthFunc(n.GREATER);break;case iu:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Me=He}},setLocked:function(He){X=He},setClear:function(He){Oe!==He&&(Fe&&(He=1-He),n.clearDepth(He),Oe=He)},reset:function(){X=!1,fe=null,Me=null,Oe=null,Fe=!1}}}function r(){let X=!1,Fe=null,fe=null,Me=null,Oe=null,He=null,ct=null,Ht=null,on=null;return{setTest:function(Pt){X||(Pt?De(n.STENCIL_TEST):nt(n.STENCIL_TEST))},setMask:function(Pt){Fe!==Pt&&!X&&(n.stencilMask(Pt),Fe=Pt)},setFunc:function(Pt,gn,ei){(fe!==Pt||Me!==gn||Oe!==ei)&&(n.stencilFunc(Pt,gn,ei),fe=Pt,Me=gn,Oe=ei)},setOp:function(Pt,gn,ei){(He!==Pt||ct!==gn||Ht!==ei)&&(n.stencilOp(Pt,gn,ei),He=Pt,ct=gn,Ht=ei)},setLocked:function(Pt){X=Pt},setClear:function(Pt){on!==Pt&&(n.clearStencil(Pt),on=Pt)},reset:function(){X=!1,Fe=null,fe=null,Me=null,Oe=null,He=null,ct=null,Ht=null,on=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,d=[],v=null,x=!1,_=null,p=null,A=null,R=null,M=null,F=null,I=null,U=new tt(0,0,0),W=0,w=!1,E=null,B=null,ue=null,ne=null,de=null;const be=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Q=0;const z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(z)[1]),H=Q>=1):z.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),H=Q>=2);let ge=null,Ae={};const ke=n.getParameter(n.SCISSOR_BOX),Ze=n.getParameter(n.VIEWPORT),Mt=new Ut().fromArray(ke),_e=new Ut().fromArray(Ze);function Le(X,Fe,fe,Me){const Oe=new Uint8Array(4),He=n.createTexture();n.bindTexture(X,He),n.texParameteri(X,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(X,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ct=0;ct<fe;ct++)X===n.TEXTURE_3D||X===n.TEXTURE_2D_ARRAY?n.texImage3D(Fe,0,n.RGBA,1,1,Me,0,n.RGBA,n.UNSIGNED_BYTE,Oe):n.texImage2D(Fe+ct,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Oe);return He}const je={};je[n.TEXTURE_2D]=Le(n.TEXTURE_2D,n.TEXTURE_2D,1),je[n.TEXTURE_CUBE_MAP]=Le(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),je[n.TEXTURE_2D_ARRAY]=Le(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),je[n.TEXTURE_3D]=Le(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),De(n.DEPTH_TEST),o.setFunc(Bs),se(!1),ve(_f),De(n.CULL_FACE),C(Sr);function De(X){u[X]!==!0&&(n.enable(X),u[X]=!0)}function nt(X){u[X]!==!1&&(n.disable(X),u[X]=!1)}function it(X,Fe){return h[X]!==Fe?(n.bindFramebuffer(X,Fe),h[X]=Fe,X===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Fe),X===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Fe),!0):!1}function _t(X,Fe){let fe=d,Me=!1;if(X){fe=f.get(Fe),fe===void 0&&(fe=[],f.set(Fe,fe));const Oe=X.textures;if(fe.length!==Oe.length||fe[0]!==n.COLOR_ATTACHMENT0){for(let He=0,ct=Oe.length;He<ct;He++)fe[He]=n.COLOR_ATTACHMENT0+He;fe.length=Oe.length,Me=!0}}else fe[0]!==n.BACK&&(fe[0]=n.BACK,Me=!0);Me&&n.drawBuffers(fe)}function L(X){return v!==X?(n.useProgram(X),v=X,!0):!1}const N={[Xr]:n.FUNC_ADD,[wv]:n.FUNC_SUBTRACT,[Rv]:n.FUNC_REVERSE_SUBTRACT};N[Cv]=n.MIN,N[Pv]=n.MAX;const K={[Lv]:n.ZERO,[Iv]:n.ONE,[Dv]:n.SRC_COLOR,[Yc]:n.SRC_ALPHA,[Vv]:n.SRC_ALPHA_SATURATE,[Ov]:n.DST_COLOR,[Nv]:n.DST_ALPHA,[Uv]:n.ONE_MINUS_SRC_COLOR,[Kc]:n.ONE_MINUS_SRC_ALPHA,[Bv]:n.ONE_MINUS_DST_COLOR,[Fv]:n.ONE_MINUS_DST_ALPHA,[kv]:n.CONSTANT_COLOR,[zv]:n.ONE_MINUS_CONSTANT_COLOR,[Hv]:n.CONSTANT_ALPHA,[Gv]:n.ONE_MINUS_CONSTANT_ALPHA};function C(X,Fe,fe,Me,Oe,He,ct,Ht,on,Pt){if(X===Sr){x===!0&&(nt(n.BLEND),x=!1);return}if(x===!1&&(De(n.BLEND),x=!0),X!==Av){if(X!==_||Pt!==w){if((p!==Xr||M!==Xr)&&(n.blendEquation(n.FUNC_ADD),p=Xr,M=Xr),Pt)switch(X){case Is:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vf:n.blendFunc(n.ONE,n.ONE);break;case xf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yf:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}else switch(X){case Is:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vf:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case xf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yf:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}A=null,R=null,F=null,I=null,U.set(0,0,0),W=0,_=X,w=Pt}return}Oe=Oe||Fe,He=He||fe,ct=ct||Me,(Fe!==p||Oe!==M)&&(n.blendEquationSeparate(N[Fe],N[Oe]),p=Fe,M=Oe),(fe!==A||Me!==R||He!==F||ct!==I)&&(n.blendFuncSeparate(K[fe],K[Me],K[He],K[ct]),A=fe,R=Me,F=He,I=ct),(Ht.equals(U)===!1||on!==W)&&(n.blendColor(Ht.r,Ht.g,Ht.b,on),U.copy(Ht),W=on),_=X,w=!1}function pe(X,Fe){X.side===Yn?nt(n.CULL_FACE):De(n.CULL_FACE);let fe=X.side===Bn;Fe&&(fe=!fe),se(fe),X.blending===Is&&X.transparent===!1?C(Sr):C(X.blending,X.blendEquation,X.blendSrc,X.blendDst,X.blendEquationAlpha,X.blendSrcAlpha,X.blendDstAlpha,X.blendColor,X.blendAlpha,X.premultipliedAlpha),o.setFunc(X.depthFunc),o.setTest(X.depthTest),o.setMask(X.depthWrite),s.setMask(X.colorWrite);const Me=X.stencilWrite;a.setTest(Me),Me&&(a.setMask(X.stencilWriteMask),a.setFunc(X.stencilFunc,X.stencilRef,X.stencilFuncMask),a.setOp(X.stencilFail,X.stencilZFail,X.stencilZPass)),ye(X.polygonOffset,X.polygonOffsetFactor,X.polygonOffsetUnits),X.alphaToCoverage===!0?De(n.SAMPLE_ALPHA_TO_COVERAGE):nt(n.SAMPLE_ALPHA_TO_COVERAGE)}function se(X){E!==X&&(X?n.frontFace(n.CW):n.frontFace(n.CCW),E=X)}function ve(X){X!==bv?(De(n.CULL_FACE),X!==B&&(X===_f?n.cullFace(n.BACK):X===Ev?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):nt(n.CULL_FACE),B=X}function oe(X){X!==ue&&(H&&n.lineWidth(X),ue=X)}function ye(X,Fe,fe){X?(De(n.POLYGON_OFFSET_FILL),(ne!==Fe||de!==fe)&&(n.polygonOffset(Fe,fe),ne=Fe,de=fe)):nt(n.POLYGON_OFFSET_FILL)}function Z(X){X?De(n.SCISSOR_TEST):nt(n.SCISSOR_TEST)}function T(X){X===void 0&&(X=n.TEXTURE0+be-1),ge!==X&&(n.activeTexture(X),ge=X)}function y(X,Fe,fe){fe===void 0&&(ge===null?fe=n.TEXTURE0+be-1:fe=ge);let Me=Ae[fe];Me===void 0&&(Me={type:void 0,texture:void 0},Ae[fe]=Me),(Me.type!==X||Me.texture!==Fe)&&(ge!==fe&&(n.activeTexture(fe),ge=fe),n.bindTexture(X,Fe||je[X]),Me.type=X,Me.texture=Fe)}function V(){const X=Ae[ge];X!==void 0&&X.type!==void 0&&(n.bindTexture(X.type,null),X.type=void 0,X.texture=void 0)}function J(){try{n.compressedTexImage2D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function ae(){try{n.compressedTexImage3D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function te(){try{n.texSubImage2D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function we(){try{n.texSubImage3D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Re(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Te(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function rt(){try{n.texStorage2D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function he(){try{n.texStorage3D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ne(){try{n.texImage2D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function We(){try{n.texImage3D.apply(n,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ke(X){Mt.equals(X)===!1&&(n.scissor(X.x,X.y,X.z,X.w),Mt.copy(X))}function Ue(X){_e.equals(X)===!1&&(n.viewport(X.x,X.y,X.z,X.w),_e.copy(X))}function xt(X,Fe){let fe=c.get(Fe);fe===void 0&&(fe=new WeakMap,c.set(Fe,fe));let Me=fe.get(X);Me===void 0&&(Me=n.getUniformBlockIndex(Fe,X.name),fe.set(X,Me))}function ft(X,Fe){const Me=c.get(Fe).get(X);l.get(Fe)!==Me&&(n.uniformBlockBinding(Fe,Me,X.__bindingPointIndex),l.set(Fe,Me))}function Nt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ge=null,Ae={},h={},f=new WeakMap,d=[],v=null,x=!1,_=null,p=null,A=null,R=null,M=null,F=null,I=null,U=new tt(0,0,0),W=0,w=!1,E=null,B=null,ue=null,ne=null,de=null,Mt.set(0,0,n.canvas.width,n.canvas.height),_e.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:De,disable:nt,bindFramebuffer:it,drawBuffers:_t,useProgram:L,setBlending:C,setMaterial:pe,setFlipSided:se,setCullFace:ve,setLineWidth:oe,setPolygonOffset:ye,setScissorTest:Z,activeTexture:T,bindTexture:y,unbindTexture:V,compressedTexImage2D:J,compressedTexImage3D:ae,texImage2D:Ne,texImage3D:We,updateUBOMapping:xt,uniformBlockBinding:ft,texStorage2D:rt,texStorage3D:he,texSubImage2D:te,texSubImage3D:we,compressedTexSubImage2D:Re,compressedTexSubImage3D:Te,scissor:Ke,viewport:Ue,reset:Nt}}function yT(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new lt,u=new WeakMap;let h;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,y){return d?new OffscreenCanvas(T,y):Go("canvas")}function x(T,y,V){let J=1;const ae=Z(T);if((ae.width>V||ae.height>V)&&(J=V/Math.max(ae.width,ae.height)),J<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const te=Math.floor(J*ae.width),we=Math.floor(J*ae.height);h===void 0&&(h=v(te,we));const Re=y?v(te,we):h;return Re.width=te,Re.height=we,Re.getContext("2d").drawImage(T,0,0,te,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+te+"x"+we+")."),Re}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),T;return T}function _(T){return T.generateMipmaps}function p(T){n.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function R(T,y,V,J,ae=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let te=y;if(y===n.RED&&(V===n.FLOAT&&(te=n.R32F),V===n.HALF_FLOAT&&(te=n.R16F),V===n.UNSIGNED_BYTE&&(te=n.R8)),y===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(te=n.R8UI),V===n.UNSIGNED_SHORT&&(te=n.R16UI),V===n.UNSIGNED_INT&&(te=n.R32UI),V===n.BYTE&&(te=n.R8I),V===n.SHORT&&(te=n.R16I),V===n.INT&&(te=n.R32I)),y===n.RG&&(V===n.FLOAT&&(te=n.RG32F),V===n.HALF_FLOAT&&(te=n.RG16F),V===n.UNSIGNED_BYTE&&(te=n.RG8)),y===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(te=n.RG8UI),V===n.UNSIGNED_SHORT&&(te=n.RG16UI),V===n.UNSIGNED_INT&&(te=n.RG32UI),V===n.BYTE&&(te=n.RG8I),V===n.SHORT&&(te=n.RG16I),V===n.INT&&(te=n.RG32I)),y===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(te=n.RGB8UI),V===n.UNSIGNED_SHORT&&(te=n.RGB16UI),V===n.UNSIGNED_INT&&(te=n.RGB32UI),V===n.BYTE&&(te=n.RGB8I),V===n.SHORT&&(te=n.RGB16I),V===n.INT&&(te=n.RGB32I)),y===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(te=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(te=n.RGBA16UI),V===n.UNSIGNED_INT&&(te=n.RGBA32UI),V===n.BYTE&&(te=n.RGBA8I),V===n.SHORT&&(te=n.RGBA16I),V===n.INT&&(te=n.RGBA32I)),y===n.RGB&&V===n.UNSIGNED_INT_5_9_9_9_REV&&(te=n.RGB9_E5),y===n.RGBA){const we=ae?cl:Rt.getTransfer(J);V===n.FLOAT&&(te=n.RGBA32F),V===n.HALF_FLOAT&&(te=n.RGBA16F),V===n.UNSIGNED_BYTE&&(te=we===Vt?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(te=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(te=n.RGB5_A1)}return(te===n.R16F||te===n.R32F||te===n.RG16F||te===n.RG32F||te===n.RGBA16F||te===n.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function M(T,y){let V;return T?y===null||y===es||y===Hs?V=n.DEPTH24_STENCIL8:y===li?V=n.DEPTH32F_STENCIL8:y===ko&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===es||y===Hs?V=n.DEPTH_COMPONENT24:y===li?V=n.DEPTH_COMPONENT32F:y===ko&&(V=n.DEPTH_COMPONENT16),V}function F(T,y){return _(T)===!0||T.isFramebufferTexture&&T.minFilter!==Un&&T.minFilter!==Hn?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function I(T){const y=T.target;y.removeEventListener("dispose",I),W(y),y.isVideoTexture&&u.delete(y)}function U(T){const y=T.target;y.removeEventListener("dispose",U),E(y)}function W(T){const y=i.get(T);if(y.__webglInit===void 0)return;const V=T.source,J=f.get(V);if(J){const ae=J[y.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&w(T),Object.keys(J).length===0&&f.delete(V)}i.remove(T)}function w(T){const y=i.get(T);n.deleteTexture(y.__webglTexture);const V=T.source,J=f.get(V);delete J[y.__cacheKey],o.memory.textures--}function E(T){const y=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(y.__webglFramebuffer[J]))for(let ae=0;ae<y.__webglFramebuffer[J].length;ae++)n.deleteFramebuffer(y.__webglFramebuffer[J][ae]);else n.deleteFramebuffer(y.__webglFramebuffer[J]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[J])}else{if(Array.isArray(y.__webglFramebuffer))for(let J=0;J<y.__webglFramebuffer.length;J++)n.deleteFramebuffer(y.__webglFramebuffer[J]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let J=0;J<y.__webglColorRenderbuffer.length;J++)y.__webglColorRenderbuffer[J]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[J]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const V=T.textures;for(let J=0,ae=V.length;J<ae;J++){const te=i.get(V[J]);te.__webglTexture&&(n.deleteTexture(te.__webglTexture),o.memory.textures--),i.remove(V[J])}i.remove(T)}let B=0;function ue(){B=0}function ne(){const T=B;return T>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),B+=1,T}function de(T){const y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function be(T,y){const V=i.get(T);if(T.isVideoTexture&&oe(T),T.isRenderTargetTexture===!1&&T.version>0&&V.__version!==T.version){const J=T.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{_e(V,T,y);return}}t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+y)}function H(T,y){const V=i.get(T);if(T.version>0&&V.__version!==T.version){_e(V,T,y);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+y)}function Q(T,y){const V=i.get(T);if(T.version>0&&V.__version!==T.version){_e(V,T,y);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+y)}function z(T,y){const V=i.get(T);if(T.version>0&&V.__version!==T.version){Le(V,T,y);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+y)}const ge={[zs]:n.REPEAT,[vr]:n.CLAMP_TO_EDGE,[ll]:n.MIRRORED_REPEAT},Ae={[Un]:n.NEAREST,[vm]:n.NEAREST_MIPMAP_NEAREST,[vo]:n.NEAREST_MIPMAP_LINEAR,[Hn]:n.LINEAR,[Wa]:n.LINEAR_MIPMAP_NEAREST,[tr]:n.LINEAR_MIPMAP_LINEAR},ke={[sx]:n.NEVER,[hx]:n.ALWAYS,[ox]:n.LESS,[Cm]:n.LEQUAL,[ax]:n.EQUAL,[ux]:n.GEQUAL,[lx]:n.GREATER,[cx]:n.NOTEQUAL};function Ze(T,y){if(y.type===li&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Hn||y.magFilter===Wa||y.magFilter===vo||y.magFilter===tr||y.minFilter===Hn||y.minFilter===Wa||y.minFilter===vo||y.minFilter===tr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,ge[y.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,ge[y.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,ge[y.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,Ae[y.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,Ae[y.minFilter]),y.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,ke[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Un||y.minFilter!==vo&&y.minFilter!==tr||y.type===li&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Mt(T,y){let V=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",I));const J=y.source;let ae=f.get(J);ae===void 0&&(ae={},f.set(J,ae));const te=de(y);if(te!==T.__cacheKey){ae[te]===void 0&&(ae[te]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ae[te].usedTimes++;const we=ae[T.__cacheKey];we!==void 0&&(ae[T.__cacheKey].usedTimes--,we.usedTimes===0&&w(y)),T.__cacheKey=te,T.__webglTexture=ae[te].texture}return V}function _e(T,y,V){let J=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(J=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(J=n.TEXTURE_3D);const ae=Mt(T,y),te=y.source;t.bindTexture(J,T.__webglTexture,n.TEXTURE0+V);const we=i.get(te);if(te.version!==we.__version||ae===!0){t.activeTexture(n.TEXTURE0+V);const Re=Rt.getPrimaries(Rt.workingColorSpace),Te=y.colorSpace===gr?null:Rt.getPrimaries(y.colorSpace),rt=y.colorSpace===gr||Re===Te?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,rt);let he=x(y.image,!1,r.maxTextureSize);he=ye(y,he);const Ne=s.convert(y.format,y.colorSpace),We=s.convert(y.type);let Ke=R(y.internalFormat,Ne,We,y.colorSpace,y.isVideoTexture);Ze(J,y);let Ue;const xt=y.mipmaps,ft=y.isVideoTexture!==!0,Nt=we.__version===void 0||ae===!0,X=te.dataReady,Fe=F(y,he);if(y.isDepthTexture)Ke=M(y.format===Gs,y.type),Nt&&(ft?t.texStorage2D(n.TEXTURE_2D,1,Ke,he.width,he.height):t.texImage2D(n.TEXTURE_2D,0,Ke,he.width,he.height,0,Ne,We,null));else if(y.isDataTexture)if(xt.length>0){ft&&Nt&&t.texStorage2D(n.TEXTURE_2D,Fe,Ke,xt[0].width,xt[0].height);for(let fe=0,Me=xt.length;fe<Me;fe++)Ue=xt[fe],ft?X&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,Ue.width,Ue.height,Ne,We,Ue.data):t.texImage2D(n.TEXTURE_2D,fe,Ke,Ue.width,Ue.height,0,Ne,We,Ue.data);y.generateMipmaps=!1}else ft?(Nt&&t.texStorage2D(n.TEXTURE_2D,Fe,Ke,he.width,he.height),X&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,he.width,he.height,Ne,We,he.data)):t.texImage2D(n.TEXTURE_2D,0,Ke,he.width,he.height,0,Ne,We,he.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){ft&&Nt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Fe,Ke,xt[0].width,xt[0].height,he.depth);for(let fe=0,Me=xt.length;fe<Me;fe++)if(Ue=xt[fe],y.format!==Zn)if(Ne!==null)if(ft){if(X)if(y.layerUpdates.size>0){const Oe=fd(Ue.width,Ue.height,y.format,y.type);for(const He of y.layerUpdates){const ct=Ue.data.subarray(He*Oe/Ue.data.BYTES_PER_ELEMENT,(He+1)*Oe/Ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,He,Ue.width,Ue.height,1,Ne,ct)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,0,Ue.width,Ue.height,he.depth,Ne,Ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,fe,Ke,Ue.width,Ue.height,he.depth,0,Ue.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ft?X&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,fe,0,0,0,Ue.width,Ue.height,he.depth,Ne,We,Ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,fe,Ke,Ue.width,Ue.height,he.depth,0,Ne,We,Ue.data)}else{ft&&Nt&&t.texStorage2D(n.TEXTURE_2D,Fe,Ke,xt[0].width,xt[0].height);for(let fe=0,Me=xt.length;fe<Me;fe++)Ue=xt[fe],y.format!==Zn?Ne!==null?ft?X&&t.compressedTexSubImage2D(n.TEXTURE_2D,fe,0,0,Ue.width,Ue.height,Ne,Ue.data):t.compressedTexImage2D(n.TEXTURE_2D,fe,Ke,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ft?X&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,Ue.width,Ue.height,Ne,We,Ue.data):t.texImage2D(n.TEXTURE_2D,fe,Ke,Ue.width,Ue.height,0,Ne,We,Ue.data)}else if(y.isDataArrayTexture)if(ft){if(Nt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Fe,Ke,he.width,he.height,he.depth),X)if(y.layerUpdates.size>0){const fe=fd(he.width,he.height,y.format,y.type);for(const Me of y.layerUpdates){const Oe=he.data.subarray(Me*fe/he.data.BYTES_PER_ELEMENT,(Me+1)*fe/he.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Me,he.width,he.height,1,Ne,We,Oe)}y.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,he.width,he.height,he.depth,Ne,We,he.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ke,he.width,he.height,he.depth,0,Ne,We,he.data);else if(y.isData3DTexture)ft?(Nt&&t.texStorage3D(n.TEXTURE_3D,Fe,Ke,he.width,he.height,he.depth),X&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,he.width,he.height,he.depth,Ne,We,he.data)):t.texImage3D(n.TEXTURE_3D,0,Ke,he.width,he.height,he.depth,0,Ne,We,he.data);else if(y.isFramebufferTexture){if(Nt)if(ft)t.texStorage2D(n.TEXTURE_2D,Fe,Ke,he.width,he.height);else{let fe=he.width,Me=he.height;for(let Oe=0;Oe<Fe;Oe++)t.texImage2D(n.TEXTURE_2D,Oe,Ke,fe,Me,0,Ne,We,null),fe>>=1,Me>>=1}}else if(xt.length>0){if(ft&&Nt){const fe=Z(xt[0]);t.texStorage2D(n.TEXTURE_2D,Fe,Ke,fe.width,fe.height)}for(let fe=0,Me=xt.length;fe<Me;fe++)Ue=xt[fe],ft?X&&t.texSubImage2D(n.TEXTURE_2D,fe,0,0,Ne,We,Ue):t.texImage2D(n.TEXTURE_2D,fe,Ke,Ne,We,Ue);y.generateMipmaps=!1}else if(ft){if(Nt){const fe=Z(he);t.texStorage2D(n.TEXTURE_2D,Fe,Ke,fe.width,fe.height)}X&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ne,We,he)}else t.texImage2D(n.TEXTURE_2D,0,Ke,Ne,We,he);_(y)&&p(J),we.__version=te.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function Le(T,y,V){if(y.image.length!==6)return;const J=Mt(T,y),ae=y.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+V);const te=i.get(ae);if(ae.version!==te.__version||J===!0){t.activeTexture(n.TEXTURE0+V);const we=Rt.getPrimaries(Rt.workingColorSpace),Re=y.colorSpace===gr?null:Rt.getPrimaries(y.colorSpace),Te=y.colorSpace===gr||we===Re?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);const rt=y.isCompressedTexture||y.image[0].isCompressedTexture,he=y.image[0]&&y.image[0].isDataTexture,Ne=[];for(let Me=0;Me<6;Me++)!rt&&!he?Ne[Me]=x(y.image[Me],!0,r.maxCubemapSize):Ne[Me]=he?y.image[Me].image:y.image[Me],Ne[Me]=ye(y,Ne[Me]);const We=Ne[0],Ke=s.convert(y.format,y.colorSpace),Ue=s.convert(y.type),xt=R(y.internalFormat,Ke,Ue,y.colorSpace),ft=y.isVideoTexture!==!0,Nt=te.__version===void 0||J===!0,X=ae.dataReady;let Fe=F(y,We);Ze(n.TEXTURE_CUBE_MAP,y);let fe;if(rt){ft&&Nt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,xt,We.width,We.height);for(let Me=0;Me<6;Me++){fe=Ne[Me].mipmaps;for(let Oe=0;Oe<fe.length;Oe++){const He=fe[Oe];y.format!==Zn?Ke!==null?ft?X&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe,0,0,He.width,He.height,Ke,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe,xt,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ft?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe,0,0,He.width,He.height,Ke,Ue,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe,xt,He.width,He.height,0,Ke,Ue,He.data)}}}else{if(fe=y.mipmaps,ft&&Nt){fe.length>0&&Fe++;const Me=Z(Ne[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Fe,xt,Me.width,Me.height)}for(let Me=0;Me<6;Me++)if(he){ft?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,0,0,Ne[Me].width,Ne[Me].height,Ke,Ue,Ne[Me].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,xt,Ne[Me].width,Ne[Me].height,0,Ke,Ue,Ne[Me].data);for(let Oe=0;Oe<fe.length;Oe++){const ct=fe[Oe].image[Me].image;ft?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe+1,0,0,ct.width,ct.height,Ke,Ue,ct.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe+1,xt,ct.width,ct.height,0,Ke,Ue,ct.data)}}else{ft?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,0,0,Ke,Ue,Ne[Me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,xt,Ke,Ue,Ne[Me]);for(let Oe=0;Oe<fe.length;Oe++){const He=fe[Oe];ft?X&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe+1,0,0,Ke,Ue,He.image[Me]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Oe+1,xt,Ke,Ue,He.image[Me])}}}_(y)&&p(n.TEXTURE_CUBE_MAP),te.__version=ae.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function je(T,y,V,J,ae,te){const we=s.convert(V.format,V.colorSpace),Re=s.convert(V.type),Te=R(V.internalFormat,we,Re,V.colorSpace),rt=i.get(y),he=i.get(V);if(he.__renderTarget=y,!rt.__hasExternalTextures){const Ne=Math.max(1,y.width>>te),We=Math.max(1,y.height>>te);ae===n.TEXTURE_3D||ae===n.TEXTURE_2D_ARRAY?t.texImage3D(ae,te,Te,Ne,We,y.depth,0,we,Re,null):t.texImage2D(ae,te,Te,Ne,We,0,we,Re,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),ve(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,ae,he.__webglTexture,0,se(y)):(ae===n.TEXTURE_2D||ae>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,J,ae,he.__webglTexture,te),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(T,y,V){if(n.bindRenderbuffer(n.RENDERBUFFER,T),y.depthBuffer){const J=y.depthTexture,ae=J&&J.isDepthTexture?J.type:null,te=M(y.stencilBuffer,ae),we=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Re=se(y);ve(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Re,te,y.width,y.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,Re,te,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,te,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,we,n.RENDERBUFFER,T)}else{const J=y.textures;for(let ae=0;ae<J.length;ae++){const te=J[ae],we=s.convert(te.format,te.colorSpace),Re=s.convert(te.type),Te=R(te.internalFormat,we,Re,te.colorSpace),rt=se(y);V&&ve(y)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,rt,Te,y.width,y.height):ve(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,rt,Te,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,Te,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function nt(T,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=i.get(y.depthTexture);J.__renderTarget=y,(!J.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),be(y.depthTexture,0);const ae=J.__webglTexture,te=se(y);if(y.depthTexture.format===Ds)ve(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ae,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ae,0);else if(y.depthTexture.format===Gs)ve(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ae,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ae,0);else throw new Error("Unknown depthTexture format")}function it(T){const y=i.get(T),V=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){const J=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),J){const ae=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,J.removeEventListener("dispose",ae)};J.addEventListener("dispose",ae),y.__depthDisposeCallback=ae}y.__boundDepthTexture=J}if(T.depthTexture&&!y.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");nt(y.__webglFramebuffer,T)}else if(V){y.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[J]),y.__webglDepthbuffer[J]===void 0)y.__webglDepthbuffer[J]=n.createRenderbuffer(),De(y.__webglDepthbuffer[J],T,!1);else{const ae=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=y.__webglDepthbuffer[J];n.bindRenderbuffer(n.RENDERBUFFER,te),n.framebufferRenderbuffer(n.FRAMEBUFFER,ae,n.RENDERBUFFER,te)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),De(y.__webglDepthbuffer,T,!1);else{const J=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,ae)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(T,y,V){const J=i.get(T);y!==void 0&&je(J.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&it(T)}function L(T){const y=T.texture,V=i.get(T),J=i.get(y);T.addEventListener("dispose",U);const ae=T.textures,te=T.isWebGLCubeRenderTarget===!0,we=ae.length>1;if(we||(J.__webglTexture===void 0&&(J.__webglTexture=n.createTexture()),J.__version=y.version,o.memory.textures++),te){V.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer[Re]=[];for(let Te=0;Te<y.mipmaps.length;Te++)V.__webglFramebuffer[Re][Te]=n.createFramebuffer()}else V.__webglFramebuffer[Re]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer=[];for(let Re=0;Re<y.mipmaps.length;Re++)V.__webglFramebuffer[Re]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(we)for(let Re=0,Te=ae.length;Re<Te;Re++){const rt=i.get(ae[Re]);rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture(),o.memory.textures++)}if(T.samples>0&&ve(T)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let Re=0;Re<ae.length;Re++){const Te=ae[Re];V.__webglColorRenderbuffer[Re]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[Re]);const rt=s.convert(Te.format,Te.colorSpace),he=s.convert(Te.type),Ne=R(Te.internalFormat,rt,he,Te.colorSpace,T.isXRRenderTarget===!0),We=se(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,We,Ne,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Re,n.RENDERBUFFER,V.__webglColorRenderbuffer[Re])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),De(V.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(te){t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),Ze(n.TEXTURE_CUBE_MAP,y);for(let Re=0;Re<6;Re++)if(y.mipmaps&&y.mipmaps.length>0)for(let Te=0;Te<y.mipmaps.length;Te++)je(V.__webglFramebuffer[Re][Te],T,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Te);else je(V.__webglFramebuffer[Re],T,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);_(y)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let Re=0,Te=ae.length;Re<Te;Re++){const rt=ae[Re],he=i.get(rt);t.bindTexture(n.TEXTURE_2D,he.__webglTexture),Ze(n.TEXTURE_2D,rt),je(V.__webglFramebuffer,T,rt,n.COLOR_ATTACHMENT0+Re,n.TEXTURE_2D,0),_(rt)&&p(n.TEXTURE_2D)}t.unbindTexture()}else{let Re=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Re=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Re,J.__webglTexture),Ze(Re,y),y.mipmaps&&y.mipmaps.length>0)for(let Te=0;Te<y.mipmaps.length;Te++)je(V.__webglFramebuffer[Te],T,y,n.COLOR_ATTACHMENT0,Re,Te);else je(V.__webglFramebuffer,T,y,n.COLOR_ATTACHMENT0,Re,0);_(y)&&p(Re),t.unbindTexture()}T.depthBuffer&&it(T)}function N(T){const y=T.textures;for(let V=0,J=y.length;V<J;V++){const ae=y[V];if(_(ae)){const te=A(T),we=i.get(ae).__webglTexture;t.bindTexture(te,we),p(te),t.unbindTexture()}}}const K=[],C=[];function pe(T){if(T.samples>0){if(ve(T)===!1){const y=T.textures,V=T.width,J=T.height;let ae=n.COLOR_BUFFER_BIT;const te=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,we=i.get(T),Re=y.length>1;if(Re)for(let Te=0;Te<y.length;Te++)t.bindFramebuffer(n.FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Te,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,we.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Te,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let Te=0;Te<y.length;Te++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(ae|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(ae|=n.STENCIL_BUFFER_BIT)),Re){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,we.__webglColorRenderbuffer[Te]);const rt=i.get(y[Te]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,rt,0)}n.blitFramebuffer(0,0,V,J,0,0,V,J,ae,n.NEAREST),l===!0&&(K.length=0,C.length=0,K.push(n.COLOR_ATTACHMENT0+Te),T.depthBuffer&&T.resolveDepthBuffer===!1&&(K.push(te),C.push(te),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,C)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,K))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Re)for(let Te=0;Te<y.length;Te++){t.bindFramebuffer(n.FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Te,n.RENDERBUFFER,we.__webglColorRenderbuffer[Te]);const rt=i.get(y[Te]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,we.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Te,n.TEXTURE_2D,rt,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const y=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function se(T){return Math.min(r.maxSamples,T.samples)}function ve(T){const y=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function oe(T){const y=o.render.frame;u.get(T)!==y&&(u.set(T,y),T.update())}function ye(T,y){const V=T.colorSpace,J=T.format,ae=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||V!==Nn&&V!==gr&&(Rt.getTransfer(V)===Vt?(J!==Zn||ae!==rr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),y}function Z(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=ne,this.resetTextureUnits=ue,this.setTexture2D=be,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=z,this.rebindTextures=_t,this.setupRenderTarget=L,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=pe,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=je,this.useMultisampledRTT=ve}function MT(n,e){function t(i,r=gr){let s;const o=Rt.getTransfer(r);if(i===rr)return n.UNSIGNED_BYTE;if(i===oh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ah)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Mm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xm)return n.BYTE;if(i===ym)return n.SHORT;if(i===ko)return n.UNSIGNED_SHORT;if(i===sh)return n.INT;if(i===es)return n.UNSIGNED_INT;if(i===li)return n.FLOAT;if(i===qo)return n.HALF_FLOAT;if(i===Sm)return n.ALPHA;if(i===bm)return n.RGB;if(i===Zn)return n.RGBA;if(i===Em)return n.LUMINANCE;if(i===Tm)return n.LUMINANCE_ALPHA;if(i===Ds)return n.DEPTH_COMPONENT;if(i===Gs)return n.DEPTH_STENCIL;if(i===lh)return n.RED;if(i===ch)return n.RED_INTEGER;if(i===Am)return n.RG;if(i===uh)return n.RG_INTEGER;if(i===hh)return n.RGBA_INTEGER;if(i===Xa||i===ja||i===$a||i===qa)if(o===Vt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Xa)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ja)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===$a)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===qa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Xa)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ja)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===$a)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===qa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ou||i===au||i===lu||i===cu)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===ou)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===au)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===lu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===cu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===uu||i===hu||i===fu)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===uu||i===hu)return o===Vt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===fu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===du||i===pu||i===mu||i===gu||i===_u||i===vu||i===xu||i===yu||i===Mu||i===Su||i===bu||i===Eu||i===Tu||i===Au)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===du)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===pu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===mu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===gu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===_u)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===vu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===xu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===yu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Mu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Su)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Eu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Tu)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Au)return o===Vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ya||i===wu||i===Ru)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Ya)return o===Vt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ru)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wm||i===Cu||i===Pu||i===Lu)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ya)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Cu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Lu)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Hs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const ST={type:"move"};class Pc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ai,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ai,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ai,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const _=t.getJointPose(x,i),p=this._getHandJoint(c,x);_!==null&&(p.matrix.fromArray(_.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=_.radius),p.visible=_!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,v=.005;c.inputState.pinching&&f>d+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ST)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ai;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const bT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ET=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class TT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new mn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Tr({vertexShader:bT,fragmentShader:ET,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new cn(new Ko(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class AT extends rs{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,d=null,v=null;const x=new TT,_=t.getContextAttributes();let p=null,A=null;const R=[],M=[],F=new lt;let I=null;const U=new In;U.viewport=new Ut;const W=new In;W.viewport=new Ut;const w=[U,W],E=new Uy;let B=null,ue=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(_e){let Le=R[_e];return Le===void 0&&(Le=new Pc,R[_e]=Le),Le.getTargetRaySpace()},this.getControllerGrip=function(_e){let Le=R[_e];return Le===void 0&&(Le=new Pc,R[_e]=Le),Le.getGripSpace()},this.getHand=function(_e){let Le=R[_e];return Le===void 0&&(Le=new Pc,R[_e]=Le),Le.getHandSpace()};function ne(_e){const Le=M.indexOf(_e.inputSource);if(Le===-1)return;const je=R[Le];je!==void 0&&(je.update(_e.inputSource,_e.frame,c||o),je.dispatchEvent({type:_e.type,data:_e.inputSource}))}function de(){r.removeEventListener("select",ne),r.removeEventListener("selectstart",ne),r.removeEventListener("selectend",ne),r.removeEventListener("squeeze",ne),r.removeEventListener("squeezestart",ne),r.removeEventListener("squeezeend",ne),r.removeEventListener("end",de),r.removeEventListener("inputsourceschange",be);for(let _e=0;_e<R.length;_e++){const Le=M[_e];Le!==null&&(M[_e]=null,R[_e].disconnect(Le))}B=null,ue=null,x.reset(),e.setRenderTarget(p),d=null,f=null,h=null,r=null,A=null,Mt.stop(),i.isPresenting=!1,e.setPixelRatio(I),e.setSize(F.width,F.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(_e){s=_e,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(_e){a=_e,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(_e){c=_e},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(_e){if(r=_e,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",ne),r.addEventListener("selectstart",ne),r.addEventListener("selectend",ne),r.addEventListener("squeeze",ne),r.addEventListener("squeezestart",ne),r.addEventListener("squeezeend",ne),r.addEventListener("end",de),r.addEventListener("inputsourceschange",be),_.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(F),r.renderState.layers===void 0){const Le={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,Le),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),A=new ts(d.framebufferWidth,d.framebufferHeight,{format:Zn,type:rr,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Le=null,je=null,De=null;_.depth&&(De=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Le=_.stencil?Gs:Ds,je=_.stencil?Hs:es);const nt={colorFormat:t.RGBA8,depthFormat:De,scaleFactor:s};h=new XRWebGLBinding(r,t),f=h.createProjectionLayer(nt),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new ts(f.textureWidth,f.textureHeight,{format:Zn,type:rr,depthTexture:new Hm(f.textureWidth,f.textureHeight,je,void 0,void 0,void 0,void 0,void 0,void 0,Le),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Mt.setContext(r),Mt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function be(_e){for(let Le=0;Le<_e.removed.length;Le++){const je=_e.removed[Le],De=M.indexOf(je);De>=0&&(M[De]=null,R[De].disconnect(je))}for(let Le=0;Le<_e.added.length;Le++){const je=_e.added[Le];let De=M.indexOf(je);if(De===-1){for(let it=0;it<R.length;it++)if(it>=M.length){M.push(je),De=it;break}else if(M[it]===null){M[it]=je,De=it;break}if(De===-1)break}const nt=R[De];nt&&nt.connect(je)}}const H=new k,Q=new k;function z(_e,Le,je){H.setFromMatrixPosition(Le.matrixWorld),Q.setFromMatrixPosition(je.matrixWorld);const De=H.distanceTo(Q),nt=Le.projectionMatrix.elements,it=je.projectionMatrix.elements,_t=nt[14]/(nt[10]-1),L=nt[14]/(nt[10]+1),N=(nt[9]+1)/nt[5],K=(nt[9]-1)/nt[5],C=(nt[8]-1)/nt[0],pe=(it[8]+1)/it[0],se=_t*C,ve=_t*pe,oe=De/(-C+pe),ye=oe*-C;if(Le.matrixWorld.decompose(_e.position,_e.quaternion,_e.scale),_e.translateX(ye),_e.translateZ(oe),_e.matrixWorld.compose(_e.position,_e.quaternion,_e.scale),_e.matrixWorldInverse.copy(_e.matrixWorld).invert(),nt[10]===-1)_e.projectionMatrix.copy(Le.projectionMatrix),_e.projectionMatrixInverse.copy(Le.projectionMatrixInverse);else{const Z=_t+oe,T=L+oe,y=se-ye,V=ve+(De-ye),J=N*L/T*Z,ae=K*L/T*Z;_e.projectionMatrix.makePerspective(y,V,J,ae,Z,T),_e.projectionMatrixInverse.copy(_e.projectionMatrix).invert()}}function ge(_e,Le){Le===null?_e.matrixWorld.copy(_e.matrix):_e.matrixWorld.multiplyMatrices(Le.matrixWorld,_e.matrix),_e.matrixWorldInverse.copy(_e.matrixWorld).invert()}this.updateCamera=function(_e){if(r===null)return;let Le=_e.near,je=_e.far;x.texture!==null&&(x.depthNear>0&&(Le=x.depthNear),x.depthFar>0&&(je=x.depthFar)),E.near=W.near=U.near=Le,E.far=W.far=U.far=je,(B!==E.near||ue!==E.far)&&(r.updateRenderState({depthNear:E.near,depthFar:E.far}),B=E.near,ue=E.far),U.layers.mask=_e.layers.mask|2,W.layers.mask=_e.layers.mask|4,E.layers.mask=U.layers.mask|W.layers.mask;const De=_e.parent,nt=E.cameras;ge(E,De);for(let it=0;it<nt.length;it++)ge(nt[it],De);nt.length===2?z(E,U,W):E.projectionMatrix.copy(U.projectionMatrix),Ae(_e,E,De)};function Ae(_e,Le,je){je===null?_e.matrix.copy(Le.matrixWorld):(_e.matrix.copy(je.matrixWorld),_e.matrix.invert(),_e.matrix.multiply(Le.matrixWorld)),_e.matrix.decompose(_e.position,_e.quaternion,_e.scale),_e.updateMatrixWorld(!0),_e.projectionMatrix.copy(Le.projectionMatrix),_e.projectionMatrixInverse.copy(Le.projectionMatrixInverse),_e.isPerspectiveCamera&&(_e.fov=Ws*2*Math.atan(1/_e.projectionMatrix.elements[5]),_e.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(_e){l=_e,f!==null&&(f.fixedFoveation=_e),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=_e)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(E)};let ke=null;function Ze(_e,Le){if(u=Le.getViewerPose(c||o),v=Le,u!==null){const je=u.views;d!==null&&(e.setRenderTargetFramebuffer(A,d.framebuffer),e.setRenderTarget(A));let De=!1;je.length!==E.cameras.length&&(E.cameras.length=0,De=!0);for(let it=0;it<je.length;it++){const _t=je[it];let L=null;if(d!==null)L=d.getViewport(_t);else{const K=h.getViewSubImage(f,_t);L=K.viewport,it===0&&(e.setRenderTargetTextures(A,K.colorTexture,f.ignoreDepthValues?void 0:K.depthStencilTexture),e.setRenderTarget(A))}let N=w[it];N===void 0&&(N=new In,N.layers.enable(it),N.viewport=new Ut,w[it]=N),N.matrix.fromArray(_t.transform.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale),N.projectionMatrix.fromArray(_t.projectionMatrix),N.projectionMatrixInverse.copy(N.projectionMatrix).invert(),N.viewport.set(L.x,L.y,L.width,L.height),it===0&&(E.matrix.copy(N.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),De===!0&&E.cameras.push(N)}const nt=r.enabledFeatures;if(nt&&nt.includes("depth-sensing")){const it=h.getDepthInformation(je[0]);it&&it.isValid&&it.texture&&x.init(e,it,r.renderState)}}for(let je=0;je<R.length;je++){const De=M[je],nt=R[je];De!==null&&nt!==void 0&&nt.update(De,Le,c||o)}ke&&ke(_e,Le),Le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Le}),v=null}const Mt=new Xm;Mt.setAnimationLoop(Ze),this.setAnimationLoop=function(_e){ke=_e},this.dispose=function(){}}}const kr=new mi,wT=new mt;function RT(n,e){function t(_,p){_.matrixAutoUpdate===!0&&_.updateMatrix(),p.value.copy(_.matrix)}function i(_,p){p.color.getRGB(_.fogColor.value,Om(n)),p.isFog?(_.fogNear.value=p.near,_.fogFar.value=p.far):p.isFogExp2&&(_.fogDensity.value=p.density)}function r(_,p,A,R,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(_,p):p.isMeshToonMaterial?(s(_,p),h(_,p)):p.isMeshPhongMaterial?(s(_,p),u(_,p)):p.isMeshStandardMaterial?(s(_,p),f(_,p),p.isMeshPhysicalMaterial&&d(_,p,M)):p.isMeshMatcapMaterial?(s(_,p),v(_,p)):p.isMeshDepthMaterial?s(_,p):p.isMeshDistanceMaterial?(s(_,p),x(_,p)):p.isMeshNormalMaterial?s(_,p):p.isLineBasicMaterial?(o(_,p),p.isLineDashedMaterial&&a(_,p)):p.isPointsMaterial?l(_,p,A,R):p.isSpriteMaterial?c(_,p):p.isShadowMaterial?(_.color.value.copy(p.color),_.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(_,p){_.opacity.value=p.opacity,p.color&&_.diffuse.value.copy(p.color),p.emissive&&_.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(_.map.value=p.map,t(p.map,_.mapTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,t(p.alphaMap,_.alphaMapTransform)),p.bumpMap&&(_.bumpMap.value=p.bumpMap,t(p.bumpMap,_.bumpMapTransform),_.bumpScale.value=p.bumpScale,p.side===Bn&&(_.bumpScale.value*=-1)),p.normalMap&&(_.normalMap.value=p.normalMap,t(p.normalMap,_.normalMapTransform),_.normalScale.value.copy(p.normalScale),p.side===Bn&&_.normalScale.value.negate()),p.displacementMap&&(_.displacementMap.value=p.displacementMap,t(p.displacementMap,_.displacementMapTransform),_.displacementScale.value=p.displacementScale,_.displacementBias.value=p.displacementBias),p.emissiveMap&&(_.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,_.emissiveMapTransform)),p.specularMap&&(_.specularMap.value=p.specularMap,t(p.specularMap,_.specularMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest);const A=e.get(p),R=A.envMap,M=A.envMapRotation;R&&(_.envMap.value=R,kr.copy(M),kr.x*=-1,kr.y*=-1,kr.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(kr.y*=-1,kr.z*=-1),_.envMapRotation.value.setFromMatrix4(wT.makeRotationFromEuler(kr)),_.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,_.reflectivity.value=p.reflectivity,_.ior.value=p.ior,_.refractionRatio.value=p.refractionRatio),p.lightMap&&(_.lightMap.value=p.lightMap,_.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,_.lightMapTransform)),p.aoMap&&(_.aoMap.value=p.aoMap,_.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,_.aoMapTransform))}function o(_,p){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,p.map&&(_.map.value=p.map,t(p.map,_.mapTransform))}function a(_,p){_.dashSize.value=p.dashSize,_.totalSize.value=p.dashSize+p.gapSize,_.scale.value=p.scale}function l(_,p,A,R){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,_.size.value=p.size*A,_.scale.value=R*.5,p.map&&(_.map.value=p.map,t(p.map,_.uvTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,t(p.alphaMap,_.alphaMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest)}function c(_,p){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,_.rotation.value=p.rotation,p.map&&(_.map.value=p.map,t(p.map,_.mapTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,t(p.alphaMap,_.alphaMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest)}function u(_,p){_.specular.value.copy(p.specular),_.shininess.value=Math.max(p.shininess,1e-4)}function h(_,p){p.gradientMap&&(_.gradientMap.value=p.gradientMap)}function f(_,p){_.metalness.value=p.metalness,p.metalnessMap&&(_.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,_.metalnessMapTransform)),_.roughness.value=p.roughness,p.roughnessMap&&(_.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,_.roughnessMapTransform)),p.envMap&&(_.envMapIntensity.value=p.envMapIntensity)}function d(_,p,A){_.ior.value=p.ior,p.sheen>0&&(_.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),_.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(_.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,_.sheenColorMapTransform)),p.sheenRoughnessMap&&(_.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,_.sheenRoughnessMapTransform))),p.clearcoat>0&&(_.clearcoat.value=p.clearcoat,_.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(_.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,_.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(_.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Bn&&_.clearcoatNormalScale.value.negate())),p.dispersion>0&&(_.dispersion.value=p.dispersion),p.iridescence>0&&(_.iridescence.value=p.iridescence,_.iridescenceIOR.value=p.iridescenceIOR,_.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(_.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,_.iridescenceMapTransform)),p.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),p.transmission>0&&(_.transmission.value=p.transmission,_.transmissionSamplerMap.value=A.texture,_.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(_.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,_.transmissionMapTransform)),_.thickness.value=p.thickness,p.thicknessMap&&(_.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=p.attenuationDistance,_.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(_.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(_.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=p.specularIntensity,_.specularColor.value.copy(p.specularColor),p.specularColorMap&&(_.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,_.specularColorMapTransform)),p.specularIntensityMap&&(_.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,_.specularIntensityMapTransform))}function v(_,p){p.matcap&&(_.matcap.value=p.matcap)}function x(_,p){const A=e.get(p).light;_.referencePosition.value.setFromMatrixPosition(A.matrixWorld),_.nearDistance.value=A.shadow.camera.near,_.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function CT(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,R){const M=R.program;i.uniformBlockBinding(A,M)}function c(A,R){let M=r[A.id];M===void 0&&(v(A),M=u(A),r[A.id]=M,A.addEventListener("dispose",_));const F=R.program;i.updateUBOMapping(A,F);const I=e.render.frame;s[A.id]!==I&&(f(A),s[A.id]=I)}function u(A){const R=h();A.__bindingPointIndex=R;const M=n.createBuffer(),F=A.__size,I=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,F,I),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,R,M),M}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const R=r[A.id],M=A.uniforms,F=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,R);for(let I=0,U=M.length;I<U;I++){const W=Array.isArray(M[I])?M[I]:[M[I]];for(let w=0,E=W.length;w<E;w++){const B=W[w];if(d(B,I,w,F)===!0){const ue=B.__offset,ne=Array.isArray(B.value)?B.value:[B.value];let de=0;for(let be=0;be<ne.length;be++){const H=ne[be],Q=x(H);typeof H=="number"||typeof H=="boolean"?(B.__data[0]=H,n.bufferSubData(n.UNIFORM_BUFFER,ue+de,B.__data)):H.isMatrix3?(B.__data[0]=H.elements[0],B.__data[1]=H.elements[1],B.__data[2]=H.elements[2],B.__data[3]=0,B.__data[4]=H.elements[3],B.__data[5]=H.elements[4],B.__data[6]=H.elements[5],B.__data[7]=0,B.__data[8]=H.elements[6],B.__data[9]=H.elements[7],B.__data[10]=H.elements[8],B.__data[11]=0):(H.toArray(B.__data,de),de+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,ue,B.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(A,R,M,F){const I=A.value,U=R+"_"+M;if(F[U]===void 0)return typeof I=="number"||typeof I=="boolean"?F[U]=I:F[U]=I.clone(),!0;{const W=F[U];if(typeof I=="number"||typeof I=="boolean"){if(W!==I)return F[U]=I,!0}else if(W.equals(I)===!1)return W.copy(I),!0}return!1}function v(A){const R=A.uniforms;let M=0;const F=16;for(let U=0,W=R.length;U<W;U++){const w=Array.isArray(R[U])?R[U]:[R[U]];for(let E=0,B=w.length;E<B;E++){const ue=w[E],ne=Array.isArray(ue.value)?ue.value:[ue.value];for(let de=0,be=ne.length;de<be;de++){const H=ne[de],Q=x(H),z=M%F,ge=z%Q.boundary,Ae=z+ge;M+=ge,Ae!==0&&F-Ae<Q.storage&&(M+=F-Ae),ue.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),ue.__offset=M,M+=Q.storage}}}const I=M%F;return I>0&&(M+=F-I),A.__size=M,A.__cache={},this}function x(A){const R={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(R.boundary=4,R.storage=4):A.isVector2?(R.boundary=8,R.storage=8):A.isVector3||A.isColor?(R.boundary=16,R.storage=12):A.isVector4?(R.boundary=16,R.storage=16):A.isMatrix3?(R.boundary=48,R.storage=48):A.isMatrix4?(R.boundary=64,R.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),R}function _(A){const R=A.target;R.removeEventListener("dispose",_);const M=o.indexOf(R.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(r[R.id]),delete r[R.id],delete s[R.id]}function p(){for(const A in r)n.deleteBuffer(r[A]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class PT{constructor(e={}){const{canvas:t=Rx(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;const v=new Uint32Array(4),x=new Int32Array(4);let _=null,p=null;const A=[],R=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ln,this.toneMapping=br,this.toneMappingExposure=1;const M=this;let F=!1,I=0,U=0,W=null,w=-1,E=null;const B=new Ut,ue=new Ut;let ne=null;const de=new tt(0);let be=0,H=t.width,Q=t.height,z=1,ge=null,Ae=null;const ke=new Ut(0,0,H,Q),Ze=new Ut(0,0,H,Q);let Mt=!1;const _e=new _h;let Le=!1,je=!1;const De=new mt,nt=new mt,it=new k,_t=new Ut,L={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let N=!1;function K(){return W===null?z:1}let C=i;function pe(S,$){return t.getContext(S,$)}try{const S={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ih}`),t.addEventListener("webglcontextlost",Me,!1),t.addEventListener("webglcontextrestored",Oe,!1),t.addEventListener("webglcontextcreationerror",He,!1),C===null){const $="webgl2";if(C=pe($,S),C===null)throw pe($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let se,ve,oe,ye,Z,T,y,V,J,ae,te,we,Re,Te,rt,he,Ne,We,Ke,Ue,xt,ft,Nt,X;function Fe(){se=new Vb(C),se.init(),ft=new MT(C,se),ve=new Db(C,se,e,ft),oe=new xT(C,se),ve.reverseDepthBuffer&&f&&oe.buffers.depth.setReversed(!0),ye=new Hb(C),Z=new oT,T=new yT(C,se,oe,Z,ve,ft,ye),y=new Nb(M),V=new Bb(M),J=new Yy(C),Nt=new Lb(C,J),ae=new kb(C,J,ye,Nt),te=new Wb(C,ae,J,ye),Ke=new Gb(C,ve,T),he=new Ub(Z),we=new sT(M,y,V,se,ve,Nt,he),Re=new RT(M,Z),Te=new lT,rt=new pT(se),We=new Pb(M,y,V,oe,te,d,l),Ne=new _T(M,te,ve),X=new CT(C,ye,ve,oe),Ue=new Ib(C,se,ye),xt=new zb(C,se,ye),ye.programs=we.programs,M.capabilities=ve,M.extensions=se,M.properties=Z,M.renderLists=Te,M.shadowMap=Ne,M.state=oe,M.info=ye}Fe();const fe=new AT(M,C);this.xr=fe,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const S=se.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=se.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(S){S!==void 0&&(z=S,this.setSize(H,Q,!1))},this.getSize=function(S){return S.set(H,Q)},this.setSize=function(S,$,ie=!0){if(fe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=S,Q=$,t.width=Math.floor(S*z),t.height=Math.floor($*z),ie===!0&&(t.style.width=S+"px",t.style.height=$+"px"),this.setViewport(0,0,S,$)},this.getDrawingBufferSize=function(S){return S.set(H*z,Q*z).floor()},this.setDrawingBufferSize=function(S,$,ie){H=S,Q=$,z=ie,t.width=Math.floor(S*ie),t.height=Math.floor($*ie),this.setViewport(0,0,S,$)},this.getCurrentViewport=function(S){return S.copy(B)},this.getViewport=function(S){return S.copy(ke)},this.setViewport=function(S,$,ie,re){S.isVector4?ke.set(S.x,S.y,S.z,S.w):ke.set(S,$,ie,re),oe.viewport(B.copy(ke).multiplyScalar(z).round())},this.getScissor=function(S){return S.copy(Ze)},this.setScissor=function(S,$,ie,re){S.isVector4?Ze.set(S.x,S.y,S.z,S.w):Ze.set(S,$,ie,re),oe.scissor(ue.copy(Ze).multiplyScalar(z).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(S){oe.setScissorTest(Mt=S)},this.setOpaqueSort=function(S){ge=S},this.setTransparentSort=function(S){Ae=S},this.getClearColor=function(S){return S.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor.apply(We,arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha.apply(We,arguments)},this.clear=function(S=!0,$=!0,ie=!0){let re=0;if(S){let j=!1;if(W!==null){const Ce=W.texture.format;j=Ce===hh||Ce===uh||Ce===ch}if(j){const Ce=W.texture.type,Be=Ce===rr||Ce===es||Ce===ko||Ce===Hs||Ce===oh||Ce===ah,Ge=We.getClearColor(),qe=We.getClearAlpha(),ot=Ge.r,ut=Ge.g,Qe=Ge.b;Be?(v[0]=ot,v[1]=ut,v[2]=Qe,v[3]=qe,C.clearBufferuiv(C.COLOR,0,v)):(x[0]=ot,x[1]=ut,x[2]=Qe,x[3]=qe,C.clearBufferiv(C.COLOR,0,x))}else re|=C.COLOR_BUFFER_BIT}$&&(re|=C.DEPTH_BUFFER_BIT),ie&&(re|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(re)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Me,!1),t.removeEventListener("webglcontextrestored",Oe,!1),t.removeEventListener("webglcontextcreationerror",He,!1),We.dispose(),Te.dispose(),rt.dispose(),Z.dispose(),y.dispose(),V.dispose(),te.dispose(),Nt.dispose(),X.dispose(),we.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Jo),fe.removeEventListener("sessionend",Qo),Bi.stop()};function Me(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),F=!0}function Oe(){console.log("THREE.WebGLRenderer: Context Restored."),F=!1;const S=ye.autoReset,$=Ne.enabled,ie=Ne.autoUpdate,re=Ne.needsUpdate,j=Ne.type;Fe(),ye.autoReset=S,Ne.enabled=$,Ne.autoUpdate=ie,Ne.needsUpdate=re,Ne.type=j}function He(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ct(S){const $=S.target;$.removeEventListener("dispose",ct),Ht($)}function Ht(S){on(S),Z.remove(S)}function on(S){const $=Z.get(S).programs;$!==void 0&&($.forEach(function(ie){we.releaseProgram(ie)}),S.isShaderMaterial&&we.releaseShaderCache(S))}this.renderBufferDirect=function(S,$,ie,re,j,Ce){$===null&&($=L);const Be=j.isMesh&&j.matrixWorld.determinant()<0,Ge=Ll(S,$,ie,re,j);oe.setMaterial(re,Be);let qe=ie.index,ot=1;if(re.wireframe===!0){if(qe=ae.getWireframeAttribute(ie),qe===void 0)return;ot=2}const ut=ie.drawRange,Qe=ie.attributes.position;let bt=ut.start*ot,Tt=(ut.start+ut.count)*ot;Ce!==null&&(bt=Math.max(bt,Ce.start*ot),Tt=Math.min(Tt,(Ce.start+Ce.count)*ot)),qe!==null?(bt=Math.max(bt,0),Tt=Math.min(Tt,qe.count)):Qe!=null&&(bt=Math.max(bt,0),Tt=Math.min(Tt,Qe.count));const tn=Tt-bt;if(tn<0||tn===1/0)return;Nt.setup(j,re,Ge,ie,qe);let $t,At=Ue;if(qe!==null&&($t=J.get(qe),At=xt,At.setIndex($t)),j.isMesh)re.wireframe===!0?(oe.setLineWidth(re.wireframeLinewidth*K()),At.setMode(C.LINES)):At.setMode(C.TRIANGLES);else if(j.isLine){let et=re.linewidth;et===void 0&&(et=1),oe.setLineWidth(et*K()),j.isLineSegments?At.setMode(C.LINES):j.isLineLoop?At.setMode(C.LINE_LOOP):At.setMode(C.LINE_STRIP)}else j.isPoints?At.setMode(C.POINTS):j.isSprite&&At.setMode(C.TRIANGLES);if(j.isBatchedMesh)if(j._multiDrawInstances!==null)At.renderMultiDrawInstances(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount,j._multiDrawInstances);else if(se.get("WEBGL_multi_draw"))At.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{const et=j._multiDrawStarts,qt=j._multiDrawCounts,wt=j._multiDrawCount,Lt=qe?J.get(qe).bytesPerElement:1,Vi=Z.get(re).currentProgram.getUniforms();for(let En=0;En<wt;En++)Vi.setValue(C,"_gl_DrawID",En),At.render(et[En]/Lt,qt[En])}else if(j.isInstancedMesh)At.renderInstances(bt,tn,j.count);else if(ie.isInstancedBufferGeometry){const et=ie._maxInstanceCount!==void 0?ie._maxInstanceCount:1/0,qt=Math.min(ie.instanceCount,et);At.renderInstances(bt,tn,qt)}else At.render(bt,tn)};function Pt(S,$,ie){S.transparent===!0&&S.side===Yn&&S.forceSinglePass===!1?(S.side=Bn,S.needsUpdate=!0,Rr(S,$,ie),S.side=Di,S.needsUpdate=!0,Rr(S,$,ie),S.side=Yn):Rr(S,$,ie)}this.compile=function(S,$,ie=null){ie===null&&(ie=S),p=rt.get(ie),p.init($),R.push(p),ie.traverseVisible(function(j){j.isLight&&j.layers.test($.layers)&&(p.pushLight(j),j.castShadow&&p.pushShadow(j))}),S!==ie&&S.traverseVisible(function(j){j.isLight&&j.layers.test($.layers)&&(p.pushLight(j),j.castShadow&&p.pushShadow(j))}),p.setupLights();const re=new Set;return S.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;const Ce=j.material;if(Ce)if(Array.isArray(Ce))for(let Be=0;Be<Ce.length;Be++){const Ge=Ce[Be];Pt(Ge,ie,j),re.add(Ge)}else Pt(Ce,ie,j),re.add(Ce)}),R.pop(),p=null,re},this.compileAsync=function(S,$,ie=null){const re=this.compile(S,$,ie);return new Promise(j=>{function Ce(){if(re.forEach(function(Be){Z.get(Be).currentProgram.isReady()&&re.delete(Be)}),re.size===0){j(S);return}setTimeout(Ce,10)}se.get("KHR_parallel_shader_compile")!==null?Ce():setTimeout(Ce,10)})};let gn=null;function ei(S){gn&&gn(S)}function Jo(){Bi.stop()}function Qo(){Bi.start()}const Bi=new Xm;Bi.setAnimationLoop(ei),typeof self<"u"&&Bi.setContext(self),this.setAnimationLoop=function(S){gn=S,fe.setAnimationLoop(S),S===null?Bi.stop():Bi.start()},fe.addEventListener("sessionstart",Jo),fe.addEventListener("sessionend",Qo),this.render=function(S,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(fe.cameraAutoUpdate===!0&&fe.updateCamera($),$=fe.getCamera()),S.isScene===!0&&S.onBeforeRender(M,S,$,W),p=rt.get(S,R.length),p.init($),R.push(p),nt.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),_e.setFromProjectionMatrix(nt),je=this.localClippingEnabled,Le=he.init(this.clippingPlanes,je),_=Te.get(S,A.length),_.init(),A.push(_),fe.enabled===!0&&fe.isPresenting===!0){const Ce=M.xr.getDepthSensingMesh();Ce!==null&&wr(Ce,$,-1/0,M.sortObjects)}wr(S,$,0,M.sortObjects),_.finish(),M.sortObjects===!0&&_.sort(ge,Ae),N=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,N&&We.addToRenderList(_,S),this.info.render.frame++,Le===!0&&he.beginShadows();const ie=p.state.shadowsArray;Ne.render(ie,S,$),Le===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();const re=_.opaque,j=_.transmissive;if(p.setupLights(),$.isArrayCamera){const Ce=$.cameras;if(j.length>0)for(let Be=0,Ge=Ce.length;Be<Ge;Be++){const qe=Ce[Be];ea(re,j,S,qe)}N&&We.render(S);for(let Be=0,Ge=Ce.length;Be<Ge;Be++){const qe=Ce[Be];ss(_,S,qe,qe.viewport)}}else j.length>0&&ea(re,j,S,$),N&&We.render(S),ss(_,S,$);W!==null&&(T.updateMultisampleRenderTarget(W),T.updateRenderTargetMipmap(W)),S.isScene===!0&&S.onAfterRender(M,S,$),Nt.resetDefaultState(),w=-1,E=null,R.pop(),R.length>0?(p=R[R.length-1],Le===!0&&he.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,A.pop(),A.length>0?_=A[A.length-1]:_=null};function wr(S,$,ie,re){if(S.visible===!1)return;if(S.layers.test($.layers)){if(S.isGroup)ie=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update($);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||_e.intersectsSprite(S)){re&&_t.setFromMatrixPosition(S.matrixWorld).applyMatrix4(nt);const Be=te.update(S),Ge=S.material;Ge.visible&&_.push(S,Be,Ge,ie,_t.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||_e.intersectsObject(S))){const Be=te.update(S),Ge=S.material;if(re&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),_t.copy(S.boundingSphere.center)):(Be.boundingSphere===null&&Be.computeBoundingSphere(),_t.copy(Be.boundingSphere.center)),_t.applyMatrix4(S.matrixWorld).applyMatrix4(nt)),Array.isArray(Ge)){const qe=Be.groups;for(let ot=0,ut=qe.length;ot<ut;ot++){const Qe=qe[ot],bt=Ge[Qe.materialIndex];bt&&bt.visible&&_.push(S,Be,bt,ie,_t.z,Qe)}}else Ge.visible&&_.push(S,Be,Ge,ie,_t.z,null)}}const Ce=S.children;for(let Be=0,Ge=Ce.length;Be<Ge;Be++)wr(Ce[Be],$,ie,re)}function ss(S,$,ie,re){const j=S.opaque,Ce=S.transmissive,Be=S.transparent;p.setupLightsView(ie),Le===!0&&he.setGlobalState(M.clippingPlanes,ie),re&&oe.viewport(B.copy(re)),j.length>0&&os(j,$,ie),Ce.length>0&&os(Ce,$,ie),Be.length>0&&os(Be,$,ie),oe.buffers.depth.setTest(!0),oe.buffers.depth.setMask(!0),oe.buffers.color.setMask(!0),oe.setPolygonOffset(!1)}function ea(S,$,ie,re){if((ie.isScene===!0?ie.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[re.id]===void 0&&(p.state.transmissionRenderTarget[re.id]=new ts(1,1,{generateMipmaps:!0,type:se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float")?qo:rr,minFilter:tr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Rt.workingColorSpace}));const Ce=p.state.transmissionRenderTarget[re.id],Be=re.viewport||B;Ce.setSize(Be.z,Be.w);const Ge=M.getRenderTarget();M.setRenderTarget(Ce),M.getClearColor(de),be=M.getClearAlpha(),be<1&&M.setClearColor(16777215,.5),M.clear(),N&&We.render(ie);const qe=M.toneMapping;M.toneMapping=br;const ot=re.viewport;if(re.viewport!==void 0&&(re.viewport=void 0),p.setupLightsView(re),Le===!0&&he.setGlobalState(M.clippingPlanes,re),os(S,ie,re),T.updateMultisampleRenderTarget(Ce),T.updateRenderTargetMipmap(Ce),se.has("WEBGL_multisampled_render_to_texture")===!1){let ut=!1;for(let Qe=0,bt=$.length;Qe<bt;Qe++){const Tt=$[Qe],tn=Tt.object,$t=Tt.geometry,At=Tt.material,et=Tt.group;if(At.side===Yn&&tn.layers.test(re.layers)){const qt=At.side;At.side=Bn,At.needsUpdate=!0,ta(tn,ie,re,$t,At,et),At.side=qt,At.needsUpdate=!0,ut=!0}}ut===!0&&(T.updateMultisampleRenderTarget(Ce),T.updateRenderTargetMipmap(Ce))}M.setRenderTarget(Ge),M.setClearColor(de,be),ot!==void 0&&(re.viewport=ot),M.toneMapping=qe}function os(S,$,ie){const re=$.isScene===!0?$.overrideMaterial:null;for(let j=0,Ce=S.length;j<Ce;j++){const Be=S[j],Ge=Be.object,qe=Be.geometry,ot=re===null?Be.material:re,ut=Be.group;Ge.layers.test(ie.layers)&&ta(Ge,$,ie,qe,ot,ut)}}function ta(S,$,ie,re,j,Ce){S.onBeforeRender(M,$,ie,re,j,Ce),S.modelViewMatrix.multiplyMatrices(ie.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),j.onBeforeRender(M,$,ie,re,S,Ce),j.transparent===!0&&j.side===Yn&&j.forceSinglePass===!1?(j.side=Bn,j.needsUpdate=!0,M.renderBufferDirect(ie,$,re,j,S,Ce),j.side=Di,j.needsUpdate=!0,M.renderBufferDirect(ie,$,re,j,S,Ce),j.side=Yn):M.renderBufferDirect(ie,$,re,j,S,Ce),S.onAfterRender(M,$,ie,re,j,Ce)}function Rr(S,$,ie){$.isScene!==!0&&($=L);const re=Z.get(S),j=p.state.lights,Ce=p.state.shadowsArray,Be=j.state.version,Ge=we.getParameters(S,j.state,Ce,$,ie),qe=we.getProgramCacheKey(Ge);let ot=re.programs;re.environment=S.isMeshStandardMaterial?$.environment:null,re.fog=$.fog,re.envMap=(S.isMeshStandardMaterial?V:y).get(S.envMap||re.environment),re.envMapRotation=re.environment!==null&&S.envMap===null?$.environmentRotation:S.envMapRotation,ot===void 0&&(S.addEventListener("dispose",ct),ot=new Map,re.programs=ot);let ut=ot.get(qe);if(ut!==void 0){if(re.currentProgram===ut&&re.lightsStateVersion===Be)return ia(S,Ge),ut}else Ge.uniforms=we.getUniforms(S),S.onBeforeCompile(Ge,M),ut=we.acquireProgram(Ge,qe),ot.set(qe,ut),re.uniforms=Ge.uniforms;const Qe=re.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Qe.clippingPlanes=he.uniform),ia(S,Ge),re.needsLights=Il(S),re.lightsStateVersion=Be,re.needsLights&&(Qe.ambientLightColor.value=j.state.ambient,Qe.lightProbe.value=j.state.probe,Qe.directionalLights.value=j.state.directional,Qe.directionalLightShadows.value=j.state.directionalShadow,Qe.spotLights.value=j.state.spot,Qe.spotLightShadows.value=j.state.spotShadow,Qe.rectAreaLights.value=j.state.rectArea,Qe.ltc_1.value=j.state.rectAreaLTC1,Qe.ltc_2.value=j.state.rectAreaLTC2,Qe.pointLights.value=j.state.point,Qe.pointLightShadows.value=j.state.pointShadow,Qe.hemisphereLights.value=j.state.hemi,Qe.directionalShadowMap.value=j.state.directionalShadowMap,Qe.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Qe.spotShadowMap.value=j.state.spotShadowMap,Qe.spotLightMatrix.value=j.state.spotLightMatrix,Qe.spotLightMap.value=j.state.spotLightMap,Qe.pointShadowMap.value=j.state.pointShadowMap,Qe.pointShadowMatrix.value=j.state.pointShadowMatrix),re.currentProgram=ut,re.uniformsList=null,ut}function na(S){if(S.uniformsList===null){const $=S.currentProgram.getUniforms();S.uniformsList=Za.seqWithValue($.seq,S.uniforms)}return S.uniformsList}function ia(S,$){const ie=Z.get(S);ie.outputColorSpace=$.outputColorSpace,ie.batching=$.batching,ie.batchingColor=$.batchingColor,ie.instancing=$.instancing,ie.instancingColor=$.instancingColor,ie.instancingMorph=$.instancingMorph,ie.skinning=$.skinning,ie.morphTargets=$.morphTargets,ie.morphNormals=$.morphNormals,ie.morphColors=$.morphColors,ie.morphTargetsCount=$.morphTargetsCount,ie.numClippingPlanes=$.numClippingPlanes,ie.numIntersection=$.numClipIntersection,ie.vertexAlphas=$.vertexAlphas,ie.vertexTangents=$.vertexTangents,ie.toneMapping=$.toneMapping}function Ll(S,$,ie,re,j){$.isScene!==!0&&($=L),T.resetTextureUnits();const Ce=$.fog,Be=re.isMeshStandardMaterial?$.environment:null,Ge=W===null?M.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Nn,qe=(re.isMeshStandardMaterial?V:y).get(re.envMap||Be),ot=re.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,ut=!!ie.attributes.tangent&&(!!re.normalMap||re.anisotropy>0),Qe=!!ie.morphAttributes.position,bt=!!ie.morphAttributes.normal,Tt=!!ie.morphAttributes.color;let tn=br;re.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(tn=M.toneMapping);const $t=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,At=$t!==void 0?$t.length:0,et=Z.get(re),qt=p.state.lights;if(Le===!0&&(je===!0||S!==E)){const _n=S===E&&re.id===w;he.setState(re,S,_n)}let wt=!1;re.version===et.__version?(et.needsLights&&et.lightsStateVersion!==qt.state.version||et.outputColorSpace!==Ge||j.isBatchedMesh&&et.batching===!1||!j.isBatchedMesh&&et.batching===!0||j.isBatchedMesh&&et.batchingColor===!0&&j.colorTexture===null||j.isBatchedMesh&&et.batchingColor===!1&&j.colorTexture!==null||j.isInstancedMesh&&et.instancing===!1||!j.isInstancedMesh&&et.instancing===!0||j.isSkinnedMesh&&et.skinning===!1||!j.isSkinnedMesh&&et.skinning===!0||j.isInstancedMesh&&et.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&et.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&et.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&et.instancingMorph===!1&&j.morphTexture!==null||et.envMap!==qe||re.fog===!0&&et.fog!==Ce||et.numClippingPlanes!==void 0&&(et.numClippingPlanes!==he.numPlanes||et.numIntersection!==he.numIntersection)||et.vertexAlphas!==ot||et.vertexTangents!==ut||et.morphTargets!==Qe||et.morphNormals!==bt||et.morphColors!==Tt||et.toneMapping!==tn||et.morphTargetsCount!==At)&&(wt=!0):(wt=!0,et.__version=re.version);let Lt=et.currentProgram;wt===!0&&(Lt=Rr(re,$,j));let Vi=!1,En=!1,ki=!1;const Wt=Lt.getUniforms(),Fn=et.uniforms;if(oe.useProgram(Lt.program)&&(Vi=!0,En=!0,ki=!0),re.id!==w&&(w=re.id,En=!0),Vi||E!==S){oe.buffers.depth.getReversed()?(De.copy(S.projectionMatrix),Px(De),Lx(De),Wt.setValue(C,"projectionMatrix",De)):Wt.setValue(C,"projectionMatrix",S.projectionMatrix),Wt.setValue(C,"viewMatrix",S.matrixWorldInverse);const xn=Wt.map.cameraPosition;xn!==void 0&&xn.setValue(C,it.setFromMatrixPosition(S.matrixWorld)),ve.logarithmicDepthBuffer&&Wt.setValue(C,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(re.isMeshPhongMaterial||re.isMeshToonMaterial||re.isMeshLambertMaterial||re.isMeshBasicMaterial||re.isMeshStandardMaterial||re.isShaderMaterial)&&Wt.setValue(C,"isOrthographic",S.isOrthographicCamera===!0),E!==S&&(E=S,En=!0,ki=!0)}if(j.isSkinnedMesh){Wt.setOptional(C,j,"bindMatrix"),Wt.setOptional(C,j,"bindMatrixInverse");const _n=j.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),Wt.setValue(C,"boneTexture",_n.boneTexture,T))}j.isBatchedMesh&&(Wt.setOptional(C,j,"batchingTexture"),Wt.setValue(C,"batchingTexture",j._matricesTexture,T),Wt.setOptional(C,j,"batchingIdTexture"),Wt.setValue(C,"batchingIdTexture",j._indirectTexture,T),Wt.setOptional(C,j,"batchingColorTexture"),j._colorsTexture!==null&&Wt.setValue(C,"batchingColorTexture",j._colorsTexture,T));const Tn=ie.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&Ke.update(j,ie,Lt),(En||et.receiveShadow!==j.receiveShadow)&&(et.receiveShadow=j.receiveShadow,Wt.setValue(C,"receiveShadow",j.receiveShadow)),re.isMeshGouraudMaterial&&re.envMap!==null&&(Fn.envMap.value=qe,Fn.flipEnvMap.value=qe.isCubeTexture&&qe.isRenderTargetTexture===!1?-1:1),re.isMeshStandardMaterial&&re.envMap===null&&$.environment!==null&&(Fn.envMapIntensity.value=$.environmentIntensity),En&&(Wt.setValue(C,"toneMappingExposure",M.toneMappingExposure),et.needsLights&&as(Fn,ki),Ce&&re.fog===!0&&Re.refreshFogUniforms(Fn,Ce),Re.refreshMaterialUniforms(Fn,re,z,Q,p.state.transmissionRenderTarget[S.id]),Za.upload(C,na(et),Fn,T)),re.isShaderMaterial&&re.uniformsNeedUpdate===!0&&(Za.upload(C,na(et),Fn,T),re.uniformsNeedUpdate=!1),re.isSpriteMaterial&&Wt.setValue(C,"center",j.center),Wt.setValue(C,"modelViewMatrix",j.modelViewMatrix),Wt.setValue(C,"normalMatrix",j.normalMatrix),Wt.setValue(C,"modelMatrix",j.matrixWorld),re.isShaderMaterial||re.isRawShaderMaterial){const _n=re.uniformsGroups;for(let xn=0,no=_n.length;xn<no;xn++){const zi=_n[xn];X.update(zi,Lt),X.bind(zi,Lt)}}return Lt}function as(S,$){S.ambientLightColor.needsUpdate=$,S.lightProbe.needsUpdate=$,S.directionalLights.needsUpdate=$,S.directionalLightShadows.needsUpdate=$,S.pointLights.needsUpdate=$,S.pointLightShadows.needsUpdate=$,S.spotLights.needsUpdate=$,S.spotLightShadows.needsUpdate=$,S.rectAreaLights.needsUpdate=$,S.hemisphereLights.needsUpdate=$}function Il(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(S,$,ie){Z.get(S.texture).__webglTexture=$,Z.get(S.depthTexture).__webglTexture=ie;const re=Z.get(S);re.__hasExternalTextures=!0,re.__autoAllocateDepthBuffer=ie===void 0,re.__autoAllocateDepthBuffer||se.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),re.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,$){const ie=Z.get(S);ie.__webglFramebuffer=$,ie.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(S,$=0,ie=0){W=S,I=$,U=ie;let re=!0,j=null,Ce=!1,Be=!1;if(S){const qe=Z.get(S);if(qe.__useDefaultFramebuffer!==void 0)oe.bindFramebuffer(C.FRAMEBUFFER,null),re=!1;else if(qe.__webglFramebuffer===void 0)T.setupRenderTarget(S);else if(qe.__hasExternalTextures)T.rebindTextures(S,Z.get(S.texture).__webglTexture,Z.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Qe=S.depthTexture;if(qe.__boundDepthTexture!==Qe){if(Qe!==null&&Z.has(Qe)&&(S.width!==Qe.image.width||S.height!==Qe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(S)}}const ot=S.texture;(ot.isData3DTexture||ot.isDataArrayTexture||ot.isCompressedArrayTexture)&&(Be=!0);const ut=Z.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(ut[$])?j=ut[$][ie]:j=ut[$],Ce=!0):S.samples>0&&T.useMultisampledRTT(S)===!1?j=Z.get(S).__webglMultisampledFramebuffer:Array.isArray(ut)?j=ut[ie]:j=ut,B.copy(S.viewport),ue.copy(S.scissor),ne=S.scissorTest}else B.copy(ke).multiplyScalar(z).floor(),ue.copy(Ze).multiplyScalar(z).floor(),ne=Mt;if(oe.bindFramebuffer(C.FRAMEBUFFER,j)&&re&&oe.drawBuffers(S,j),oe.viewport(B),oe.scissor(ue),oe.setScissorTest(ne),Ce){const qe=Z.get(S.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+$,qe.__webglTexture,ie)}else if(Be){const qe=Z.get(S.texture),ot=$||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,qe.__webglTexture,ie||0,ot)}w=-1},this.readRenderTargetPixels=function(S,$,ie,re,j,Ce,Be){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ge=Z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Be!==void 0&&(Ge=Ge[Be]),Ge){oe.bindFramebuffer(C.FRAMEBUFFER,Ge);try{const qe=S.texture,ot=qe.format,ut=qe.type;if(!ve.textureFormatReadable(ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ve.textureTypeReadable(ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=S.width-re&&ie>=0&&ie<=S.height-j&&C.readPixels($,ie,re,j,ft.convert(ot),ft.convert(ut),Ce)}finally{const qe=W!==null?Z.get(W).__webglFramebuffer:null;oe.bindFramebuffer(C.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(S,$,ie,re,j,Ce,Be){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ge=Z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Be!==void 0&&(Ge=Ge[Be]),Ge){const qe=S.texture,ot=qe.format,ut=qe.type;if(!ve.textureFormatReadable(ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ve.textureTypeReadable(ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=S.width-re&&ie>=0&&ie<=S.height-j){oe.bindFramebuffer(C.FRAMEBUFFER,Ge);const Qe=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Qe),C.bufferData(C.PIXEL_PACK_BUFFER,Ce.byteLength,C.STREAM_READ),C.readPixels($,ie,re,j,ft.convert(ot),ft.convert(ut),0);const bt=W!==null?Z.get(W).__webglFramebuffer:null;oe.bindFramebuffer(C.FRAMEBUFFER,bt);const Tt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Cx(C,Tt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Qe),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,Ce),C.deleteBuffer(Qe),C.deleteSync(Tt),Ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,$=null,ie=0){S.isTexture!==!0&&(As("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,S=arguments[1]);const re=Math.pow(2,-ie),j=Math.floor(S.image.width*re),Ce=Math.floor(S.image.height*re),Be=$!==null?$.x:0,Ge=$!==null?$.y:0;T.setTexture2D(S,0),C.copyTexSubImage2D(C.TEXTURE_2D,ie,0,0,Be,Ge,j,Ce),oe.unbindTexture()};const Dl=C.createFramebuffer(),ls=C.createFramebuffer();this.copyTextureToTexture=function(S,$,ie=null,re=null,j=0,Ce=null){S.isTexture!==!0&&(As("WebGLRenderer: copyTextureToTexture function signature has changed."),re=arguments[0]||null,S=arguments[1],$=arguments[2],Ce=arguments[3]||0,ie=null),Ce===null&&(j!==0?(As("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ce=j,j=0):Ce=0);let Be,Ge,qe,ot,ut,Qe,bt,Tt,tn;const $t=S.isCompressedTexture?S.mipmaps[Ce]:S.image;if(ie!==null)Be=ie.max.x-ie.min.x,Ge=ie.max.y-ie.min.y,qe=ie.isBox3?ie.max.z-ie.min.z:1,ot=ie.min.x,ut=ie.min.y,Qe=ie.isBox3?ie.min.z:0;else{const Tn=Math.pow(2,-j);Be=Math.floor($t.width*Tn),Ge=Math.floor($t.height*Tn),S.isDataArrayTexture?qe=$t.depth:S.isData3DTexture?qe=Math.floor($t.depth*Tn):qe=1,ot=0,ut=0,Qe=0}re!==null?(bt=re.x,Tt=re.y,tn=re.z):(bt=0,Tt=0,tn=0);const At=ft.convert($.format),et=ft.convert($.type);let qt;$.isData3DTexture?(T.setTexture3D($,0),qt=C.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(T.setTexture2DArray($,0),qt=C.TEXTURE_2D_ARRAY):(T.setTexture2D($,0),qt=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,$.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,$.unpackAlignment);const wt=C.getParameter(C.UNPACK_ROW_LENGTH),Lt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Vi=C.getParameter(C.UNPACK_SKIP_PIXELS),En=C.getParameter(C.UNPACK_SKIP_ROWS),ki=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,$t.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,$t.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,ot),C.pixelStorei(C.UNPACK_SKIP_ROWS,ut),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Qe);const Wt=S.isDataArrayTexture||S.isData3DTexture,Fn=$.isDataArrayTexture||$.isData3DTexture;if(S.isDepthTexture){const Tn=Z.get(S),_n=Z.get($),xn=Z.get(Tn.__renderTarget),no=Z.get(_n.__renderTarget);oe.bindFramebuffer(C.READ_FRAMEBUFFER,xn.__webglFramebuffer),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,no.__webglFramebuffer);for(let zi=0;zi<qe;zi++)Wt&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Z.get(S).__webglTexture,j,Qe+zi),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Z.get($).__webglTexture,Ce,tn+zi)),C.blitFramebuffer(ot,ut,Be,Ge,bt,Tt,Be,Ge,C.DEPTH_BUFFER_BIT,C.NEAREST);oe.bindFramebuffer(C.READ_FRAMEBUFFER,null),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(j!==0||S.isRenderTargetTexture||Z.has(S)){const Tn=Z.get(S),_n=Z.get($);oe.bindFramebuffer(C.READ_FRAMEBUFFER,Dl),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,ls);for(let xn=0;xn<qe;xn++)Wt?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Tn.__webglTexture,j,Qe+xn):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Tn.__webglTexture,j),Fn?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,_n.__webglTexture,Ce,tn+xn):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,_n.__webglTexture,Ce),j!==0?C.blitFramebuffer(ot,ut,Be,Ge,bt,Tt,Be,Ge,C.COLOR_BUFFER_BIT,C.NEAREST):Fn?C.copyTexSubImage3D(qt,Ce,bt,Tt,tn+xn,ot,ut,Be,Ge):C.copyTexSubImage2D(qt,Ce,bt,Tt,ot,ut,Be,Ge);oe.bindFramebuffer(C.READ_FRAMEBUFFER,null),oe.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else Fn?S.isDataTexture||S.isData3DTexture?C.texSubImage3D(qt,Ce,bt,Tt,tn,Be,Ge,qe,At,et,$t.data):$.isCompressedArrayTexture?C.compressedTexSubImage3D(qt,Ce,bt,Tt,tn,Be,Ge,qe,At,$t.data):C.texSubImage3D(qt,Ce,bt,Tt,tn,Be,Ge,qe,At,et,$t):S.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,Ce,bt,Tt,Be,Ge,At,et,$t.data):S.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,Ce,bt,Tt,$t.width,$t.height,At,$t.data):C.texSubImage2D(C.TEXTURE_2D,Ce,bt,Tt,Be,Ge,At,et,$t);C.pixelStorei(C.UNPACK_ROW_LENGTH,wt),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Lt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Vi),C.pixelStorei(C.UNPACK_SKIP_ROWS,En),C.pixelStorei(C.UNPACK_SKIP_IMAGES,ki),Ce===0&&$.generateMipmaps&&C.generateMipmap(qt),oe.unbindTexture()},this.copyTextureToTexture3D=function(S,$,ie=null,re=null,j=0){return S.isTexture!==!0&&(As("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ie=arguments[0]||null,re=arguments[1]||null,S=arguments[2],$=arguments[3],j=arguments[4]||0),As('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,$,ie,re,j)},this.initRenderTarget=function(S){Z.get(S).__webglFramebuffer===void 0&&T.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?T.setTextureCube(S,0):S.isData3DTexture?T.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?T.setTexture2DArray(S,0):T.setTexture2D(S,0),oe.unbindTexture()},this.resetState=function(){I=0,U=0,W=null,oe.reset(),Nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return nr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rt._getUnpackColorSpace()}}class LT extends Ar{constructor(e){super(e)}load(e,t,i,r){const s=this,o=new Al(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{t(s.parse(a))}catch(l){r?r(l):console.error(l),s.manager.itemError(e)}},i,r)}parse(e){function t(c){const u=new DataView(c),h=32/8*3+32/8*3*3+16/8,f=u.getUint32(80,!0);if(80+32/8+f*h===u.byteLength)return!0;const v=[115,111,108,105,100];for(let x=0;x<5;x++)if(i(v,u,x))return!1;return!0}function i(c,u,h){for(let f=0,d=c.length;f<d;f++)if(c[f]!==u.getUint8(h+f))return!1;return!0}function r(c){const u=new DataView(c),h=u.getUint32(80,!0);let f,d,v,x=!1,_,p,A,R,M;for(let B=0;B<70;B++)u.getUint32(B,!1)==1129270351&&u.getUint8(B+4)==82&&u.getUint8(B+5)==61&&(x=!0,_=new Float32Array(h*3*3),p=u.getUint8(B+6)/255,A=u.getUint8(B+7)/255,R=u.getUint8(B+8)/255,M=u.getUint8(B+9)/255);const F=84,I=50,U=new sn,W=new Float32Array(h*3*3),w=new Float32Array(h*3*3),E=new tt;for(let B=0;B<h;B++){const ue=F+B*I,ne=u.getFloat32(ue,!0),de=u.getFloat32(ue+4,!0),be=u.getFloat32(ue+8,!0);if(x){const H=u.getUint16(ue+48,!0);(H&32768)===0?(f=(H&31)/31,d=(H>>5&31)/31,v=(H>>10&31)/31):(f=p,d=A,v=R)}for(let H=1;H<=3;H++){const Q=ue+H*12,z=B*3*3+(H-1)*3;W[z]=u.getFloat32(Q,!0),W[z+1]=u.getFloat32(Q+4,!0),W[z+2]=u.getFloat32(Q+8,!0),w[z]=ne,w[z+1]=de,w[z+2]=be,x&&(E.setRGB(f,d,v,ln),_[z]=E.r,_[z+1]=E.g,_[z+2]=E.b)}}return U.setAttribute("position",new Jt(W,3)),U.setAttribute("normal",new Jt(w,3)),x&&(U.setAttribute("color",new Jt(_,3)),U.hasColors=!0,U.alpha=M),U}function s(c){const u=new sn,h=/solid([\s\S]*?)endsolid/g,f=/facet([\s\S]*?)endfacet/g,d=/solid\s(.+)/;let v=0;const x=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,_=new RegExp("vertex"+x+x+x,"g"),p=new RegExp("normal"+x+x+x,"g"),A=[],R=[],M=[],F=new k;let I,U=0,W=0,w=0;for(;(I=h.exec(c))!==null;){W=w;const E=I[0],B=(I=d.exec(E))!==null?I[1]:"";for(M.push(B);(I=f.exec(E))!==null;){let de=0,be=0;const H=I[0];for(;(I=p.exec(H))!==null;)F.x=parseFloat(I[1]),F.y=parseFloat(I[2]),F.z=parseFloat(I[3]),be++;for(;(I=_.exec(H))!==null;)A.push(parseFloat(I[1]),parseFloat(I[2]),parseFloat(I[3])),R.push(F.x,F.y,F.z),de++,w++;be!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+v),de!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+v),v++}const ue=W,ne=w-W;u.userData.groupNames=M,u.addGroup(ue,ne,U),U++}return u.setAttribute("position",new Zt(A,3)),u.setAttribute("normal",new Zt(R,3)),u}function o(c){return typeof c!="string"?new TextDecoder().decode(c):c}function a(c){if(typeof c=="string"){const u=new Uint8Array(c.length);for(let h=0;h<c.length;h++)u[h]=c.charCodeAt(h)&255;return u.buffer||u}else return c}const l=a(e);return t(l)?r(l):s(o(e))}}const IT=/^[og]\s*(.+)?/,DT=/^mtllib /,UT=/^usemtl /,NT=/^usemap /,Od=/\s+/,Bd=new k,Lc=new k,Vd=new k,kd=new k,jn=new k,Ba=new tt;function FT(){const n={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(e,t){if(this.object&&this.object.fromDeclaration===!1){this.object.name=e,this.object.fromDeclaration=t!==!1;return}const i=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:t!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(r,s){const o=this._finalize(!1);o&&(o.inherited||o.groupCount<=0)&&this.materials.splice(o.index,1);const a={index:this.materials.length,name:r||"",mtllib:Array.isArray(s)&&s.length>0?s[s.length-1]:"",smooth:o!==void 0?o.smooth:this.smooth,groupStart:o!==void 0?o.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(l){const c={index:typeof l=="number"?l:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return c.clone=this.clone.bind(c),c}};return this.materials.push(a),a},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(r){const s=this.currentMaterial();if(s&&s.groupEnd===-1&&(s.groupEnd=this.geometry.vertices.length/3,s.groupCount=s.groupEnd-s.groupStart,s.inherited=!1),r&&this.materials.length>1)for(let o=this.materials.length-1;o>=0;o--)this.materials[o].groupCount<=0&&this.materials.splice(o,1);return r&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),s}},i&&i.name&&typeof i.clone=="function"){const r=i.clone(0);r.inherited=!0,this.object.materials.push(r)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseNormalIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/3)*3},parseUVIndex:function(e,t){const i=parseInt(e,10);return(i>=0?i-1:i+t/2)*2},addVertex:function(e,t,i){const r=this.vertices,s=this.object.geometry.vertices;s.push(r[e+0],r[e+1],r[e+2]),s.push(r[t+0],r[t+1],r[t+2]),s.push(r[i+0],r[i+1],r[i+2])},addVertexPoint:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addVertexLine:function(e){const t=this.vertices;this.object.geometry.vertices.push(t[e+0],t[e+1],t[e+2])},addNormal:function(e,t,i){const r=this.normals,s=this.object.geometry.normals;s.push(r[e+0],r[e+1],r[e+2]),s.push(r[t+0],r[t+1],r[t+2]),s.push(r[i+0],r[i+1],r[i+2])},addFaceNormal:function(e,t,i){const r=this.vertices,s=this.object.geometry.normals;Bd.fromArray(r,e),Lc.fromArray(r,t),Vd.fromArray(r,i),jn.subVectors(Vd,Lc),kd.subVectors(Bd,Lc),jn.cross(kd),jn.normalize(),s.push(jn.x,jn.y,jn.z),s.push(jn.x,jn.y,jn.z),s.push(jn.x,jn.y,jn.z)},addColor:function(e,t,i){const r=this.colors,s=this.object.geometry.colors;r[e]!==void 0&&s.push(r[e+0],r[e+1],r[e+2]),r[t]!==void 0&&s.push(r[t+0],r[t+1],r[t+2]),r[i]!==void 0&&s.push(r[i+0],r[i+1],r[i+2])},addUV:function(e,t,i){const r=this.uvs,s=this.object.geometry.uvs;s.push(r[e+0],r[e+1]),s.push(r[t+0],r[t+1]),s.push(r[i+0],r[i+1])},addDefaultUV:function(){const e=this.object.geometry.uvs;e.push(0,0),e.push(0,0),e.push(0,0)},addUVLine:function(e){const t=this.uvs;this.object.geometry.uvs.push(t[e+0],t[e+1])},addFace:function(e,t,i,r,s,o,a,l,c){const u=this.vertices.length;let h=this.parseVertexIndex(e,u),f=this.parseVertexIndex(t,u),d=this.parseVertexIndex(i,u);if(this.addVertex(h,f,d),this.addColor(h,f,d),a!==void 0&&a!==""){const v=this.normals.length;h=this.parseNormalIndex(a,v),f=this.parseNormalIndex(l,v),d=this.parseNormalIndex(c,v),this.addNormal(h,f,d)}else this.addFaceNormal(h,f,d);if(r!==void 0&&r!==""){const v=this.uvs.length;h=this.parseUVIndex(r,v),f=this.parseUVIndex(s,v),d=this.parseUVIndex(o,v),this.addUV(h,f,d),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(e){this.object.geometry.type="Points";const t=this.vertices.length;for(let i=0,r=e.length;i<r;i++){const s=this.parseVertexIndex(e[i],t);this.addVertexPoint(s),this.addColor(s)}},addLineGeometry:function(e,t){this.object.geometry.type="Line";const i=this.vertices.length,r=this.uvs.length;for(let s=0,o=e.length;s<o;s++)this.addVertexLine(this.parseVertexIndex(e[s],i));for(let s=0,o=t.length;s<o;s++)this.addUVLine(this.parseUVIndex(t[s],r))}};return n.startObject("",!1),n}class OT extends Ar{constructor(e){super(e),this.materials=null}load(e,t,i,r){const s=this,o=new Al(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{t(s.parse(a))}catch(l){r?r(l):console.error(l),s.manager.itemError(e)}},i,r)}setMaterials(e){return this.materials=e,this}parse(e){const t=new FT;e.indexOf(`\r
`)!==-1&&(e=e.replace(/\r\n/g,`
`)),e.indexOf(`\\
`)!==-1&&(e=e.replace(/\\\n/g,""));const i=e.split(`
`);let r=[];for(let a=0,l=i.length;a<l;a++){const c=i[a].trimStart();if(c.length===0)continue;const u=c.charAt(0);if(u!=="#")if(u==="v"){const h=c.split(Od);switch(h[0]){case"v":t.vertices.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3])),h.length>=7?(Ba.setRGB(parseFloat(h[4]),parseFloat(h[5]),parseFloat(h[6]),ln),t.colors.push(Ba.r,Ba.g,Ba.b)):t.colors.push(void 0,void 0,void 0);break;case"vn":t.normals.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3]));break;case"vt":t.uvs.push(parseFloat(h[1]),parseFloat(h[2]));break}}else if(u==="f"){const f=c.slice(1).trim().split(Od),d=[];for(let x=0,_=f.length;x<_;x++){const p=f[x];if(p.length>0){const A=p.split("/");d.push(A)}}const v=d[0];for(let x=1,_=d.length-1;x<_;x++){const p=d[x],A=d[x+1];t.addFace(v[0],p[0],A[0],v[1],p[1],A[1],v[2],p[2],A[2])}}else if(u==="l"){const h=c.substring(1).trim().split(" ");let f=[];const d=[];if(c.indexOf("/")===-1)f=h;else for(let v=0,x=h.length;v<x;v++){const _=h[v].split("/");_[0]!==""&&f.push(_[0]),_[1]!==""&&d.push(_[1])}t.addLineGeometry(f,d)}else if(u==="p"){const f=c.slice(1).trim().split(" ");t.addPointGeometry(f)}else if((r=IT.exec(c))!==null){const h=(" "+r[0].slice(1).trim()).slice(1);t.startObject(h)}else if(UT.test(c))t.object.startMaterial(c.substring(7).trim(),t.materialLibraries);else if(DT.test(c))t.materialLibraries.push(c.substring(7).trim());else if(NT.test(c))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(u==="s"){if(r=c.split(" "),r.length>1){const f=r[1].trim().toLowerCase();t.object.smooth=f!=="0"&&f!=="off"}else t.object.smooth=!0;const h=t.object.currentMaterial();h&&(h.smooth=t.object.smooth)}else{if(c==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+c+'"')}}t.finalize();const s=new Ai;if(s.materialLibraries=[].concat(t.materialLibraries),!(t.objects.length===1&&t.objects[0].geometry.vertices.length===0)===!0)for(let a=0,l=t.objects.length;a<l;a++){const c=t.objects[a],u=c.geometry,h=c.materials,f=u.type==="Line",d=u.type==="Points";let v=!1;if(u.vertices.length===0)continue;const x=new sn;x.setAttribute("position",new Zt(u.vertices,3)),u.normals.length>0&&x.setAttribute("normal",new Zt(u.normals,3)),u.colors.length>0&&(v=!0,x.setAttribute("color",new Zt(u.colors,3))),u.hasUVIndices===!0&&x.setAttribute("uv",new Zt(u.uvs,2));const _=[];for(let A=0,R=h.length;A<R;A++){const M=h[A],F=M.name+"_"+M.smooth+"_"+v;let I=t.materials[F];if(this.materials!==null){if(I=this.materials.create(M.name),f&&I&&!(I instanceof Qr)){const U=new Qr;Gn.prototype.copy.call(U,I),U.color.copy(I.color),I=U}else if(d&&I&&!(I instanceof Rs)){const U=new Rs({size:10,sizeAttenuation:!1});Gn.prototype.copy.call(U,I),U.color.copy(I.color),U.map=I.map,I=U}}I===void 0&&(f?I=new Qr:d?I=new Rs({size:1,sizeAttenuation:!1}):I=new uy,I.name=M.name,I.flatShading=!M.smooth,I.vertexColors=v,t.materials[F]=I),_.push(I)}let p;if(_.length>1){for(let A=0,R=h.length;A<R;A++){const M=h[A];x.addGroup(M.groupStart,M.groupCount,A)}f?p=new Wo(x,_):d?p=new Ka(x,_):p=new cn(x,_)}else f?p=new Wo(x,_[0]):d?p=new Ka(x,_[0]):p=new cn(x,_[0]);p.name=c.name,s.add(p)}else if(t.vertices.length>0){const a=new Rs({size:1,sizeAttenuation:!1}),l=new sn;l.setAttribute("position",new Zt(t.vertices,3)),t.colors.length>0&&t.colors[0]!==void 0&&(l.setAttribute("color",new Zt(t.colors,3)),a.vertexColors=!0);const c=new Ka(l,a);s.add(c)}return s}}function zd(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,l=new sn;let c=0;for(let u=0;u<n.length;++u){const h=n[u];let f=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in h.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;s[d]===void 0&&(s[d]=[]),s[d].push(h.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in h.morphAttributes){if(!r.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(h.morphAttributes[d])}if(e){let d;if(t)d=h.index.count;else if(h.attributes.position!==void 0)d=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,u),c+=d}}if(t){let u=0;const h=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let v=0;v<d.count;++v)h.push(d.getX(v)+u);u+=n[f].attributes.position.count}l.setIndex(h)}for(const u in s){const h=Hd(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let f=0;f<h;++f){const d=[];for(let x=0;x<o[u].length;++x)d.push(o[u][x][f]);const v=Hd(d);if(!v)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(v)}}return l}function Hd(n){let e,t,i,r=-1,s=0;for(let c=0;c<n.length;++c){const u=n[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new Jt(o,t,i);let l=0;for(let c=0;c<n.length;++c){const u=n[c];if(u.isInterleavedBufferAttribute){const h=l/t;for(let f=0,d=u.count;f<d;f++)for(let v=0;v<t;v++){const x=u.getComponent(f,v);a.setComponent(f+h,v,x)}}else o.set(u.array,l);l+=u.count*t}return r!==void 0&&(a.gpuType=r),a}function Gd(n,e){if(e===tx)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Iu||e===Rm){let t=n.getIndex();if(t===null){const o=[],a=n.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);n.setIndex(o),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}const i=t.count-2,r=[];if(e===Iu)for(let o=1;o<=i;o++)r.push(t.getX(0)),r.push(t.getX(o)),r.push(t.getX(o+1));else for(let o=0;o<i;o++)o%2===0?(r.push(t.getX(o)),r.push(t.getX(o+1)),r.push(t.getX(o+2))):(r.push(t.getX(o+2)),r.push(t.getX(o+1)),r.push(t.getX(o)));r.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=n.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}class BT extends Ar{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new GT(t)}),this.register(function(t){return new WT(t)}),this.register(function(t){return new QT(t)}),this.register(function(t){return new eA(t)}),this.register(function(t){return new tA(t)}),this.register(function(t){return new jT(t)}),this.register(function(t){return new $T(t)}),this.register(function(t){return new qT(t)}),this.register(function(t){return new YT(t)}),this.register(function(t){return new HT(t)}),this.register(function(t){return new KT(t)}),this.register(function(t){return new XT(t)}),this.register(function(t){return new JT(t)}),this.register(function(t){return new ZT(t)}),this.register(function(t){return new kT(t)}),this.register(function(t){return new nA(t)}),this.register(function(t){return new iA(t)})}load(e,t,i,r){const s=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const c=Lo.extractUrlBase(e);o=Lo.resolveURL(c,this.path)}else o=Lo.extractUrlBase(e);this.manager.itemStart(e);const a=function(c){r?r(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Al(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,o,function(u){t(u),s.manager.itemEnd(e)},a)}catch(u){a(u)}},i,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,r){let s;const o={},a={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Km){try{o[St.KHR_BINARY_GLTF]=new rA(e)}catch(h){r&&r(h);return}s=JSON.parse(o[St.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new _A(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){const h=s.extensionsUsed[u],f=s.extensionsRequired||[];switch(h){case St.KHR_MATERIALS_UNLIT:o[h]=new zT;break;case St.KHR_DRACO_MESH_COMPRESSION:o[h]=new sA(s,this.dracoLoader);break;case St.KHR_TEXTURE_TRANSFORM:o[h]=new oA;break;case St.KHR_MESH_QUANTIZATION:o[h]=new aA;break;default:f.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(i,r)}parseAsync(e,t){const i=this;return new Promise(function(r,s){i.parse(e,t,r,s)})}}function VT(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}const St={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class kT{constructor(e){this.parser=e,this.name=St.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,r=t.length;i<r;i++){const s=t[i];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let r=t.cache.get(i);if(r)return r;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const u=new tt(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Nn);const h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Fu(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ly(u),c.distance=h;break;case"spot":c=new Cy(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,Zi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),r=Promise.resolve(c),t.cache.add(i,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,s=i.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return i._getNodeRef(t.cache,a,l)})}}class zT{constructor(){this.name=St.KHR_MATERIALS_UNLIT}getMaterialType(){return Ti}extendParams(e,t,i){const r=[];e.color=new tt(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Nn),e.opacity=o[3]}s.baseColorTexture!==void 0&&r.push(i.assignTexture(e,"map",s.baseColorTexture,ln))}return Promise.all(r)}}class HT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class GT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(i.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new lt(a,a)}return Promise.all(s)}}class WT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_DISPERSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class XT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}}class jT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_SHEEN}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new tt(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=r.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Nn)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(i.assignTexture(t,"sheenColorMap",o.sheenColorTexture,ln)),o.sheenRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}}class $T{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(i.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}}class qT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_VOLUME}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(i.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new tt().setRGB(a[0],a[1],a[2],Nn),Promise.all(s)}}class YT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_IOR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class KT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_SPECULAR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(i.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new tt().setRGB(a[0],a[1],a[2],Nn),o.specularColorTexture!==void 0&&s.push(i.assignTexture(t,"specularColorMap",o.specularColorTexture,ln)),Promise.all(s)}}class ZT{constructor(e){this.parser=e,this.name=St.EXT_MATERIALS_BUMP}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(i.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}}class JT{constructor(e){this.parser=e,this.name=St.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Fi}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(i.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}}class QT{constructor(e){this.parser=e,this.name=St.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,r=i.textures[e];if(!r.extensions||!r.extensions[this.name])return null;const s=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}}class eA{constructor(e){this.parser=e,this.name=St.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,r=i.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let l=i.textureLoader;if(a.uri){const c=i.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return i.loadTextureImage(e,o.source,l);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class tA{constructor(e){this.parser=e,this.name=St.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,r=i.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let l=i.textureLoader;if(a.uri){const c=i.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return i.loadTextureImage(e,o.source,l);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class nA{constructor(e){this.name=St.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const r=i.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){const l=r.byteOffset||0,c=r.byteLength||0,u=r.count,h=r.byteStride,f=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,f,r.mode,r.filter).then(function(d){return d.buffer}):o.ready.then(function(){const d=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(d),u,h,f,r.mode,r.filter),d})})}else return null}}class iA{constructor(e){this.name=St.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const r=t.meshes[i.mesh];for(const c of r.primitives)if(c.mode!==$n.TRIANGLES&&c.mode!==$n.TRIANGLE_STRIP&&c.mode!==$n.TRIANGLE_FAN&&c.mode!==void 0)return null;const o=i.extensions[this.name].attributes,a=[],l={};for(const c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{const u=c.pop(),h=u.isGroup?u.children:[u],f=c[0].count,d=[];for(const v of h){const x=new mt,_=new k,p=new Ui,A=new k(1,1,1),R=new oy(v.geometry,v.material,f);for(let M=0;M<f;M++)l.TRANSLATION&&_.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,M),l.SCALE&&A.fromBufferAttribute(l.SCALE,M),R.setMatrixAt(M,x.compose(_,p,A));for(const M in l)if(M==="_COLOR_0"){const F=l[M];R.instanceColor=new Uu(F.array,F.itemSize,F.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&v.geometry.setAttribute(M,l[M]);Qt.prototype.copy.call(R,v),this.parser.assignFinalMaterial(R),d.push(R)}return u.isGroup?(u.clear(),u.add(...d),u):d[0]}))}}const Km="glTF",mo=12,Wd={JSON:1313821514,BIN:5130562};class rA{constructor(e){this.name=St.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,mo),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Km)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const r=this.header.length-mo,s=new DataView(e,mo);let o=0;for(;o<r;){const a=s.getUint32(o,!0);o+=4;const l=s.getUint32(o,!0);if(o+=4,l===Wd.JSON){const c=new Uint8Array(e,mo+o,a);this.content=i.decode(c)}else if(l===Wd.BIN){const c=mo+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class sA{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=St.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(const u in o){const h=Vu[u]||u.toLowerCase();a[h]=o[u]}for(const u in e.attributes){const h=Vu[u]||u.toLowerCase();if(o[u]!==void 0){const f=i.accessors[e.attributes[u]],d=Ns[f.componentType];c[h]=d.name,l[h]=f.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,f){r.decodeDracoFile(u,function(d){for(const v in d.attributes){const x=d.attributes[v],_=l[v];_!==void 0&&(x.normalized=_)}h(d)},a,c,Nn,f)})})}}class oA{constructor(){this.name=St.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class aA{constructor(){this.name=St.KHR_MESH_QUANTIZATION}}class Zm extends Zo{constructor(e,t,i,r){super(e,t,i,r)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let o=0;o!==r;o++)t[o]=i[s+o];return t}interpolate_(e,t,i,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=r-t,h=(i-t)/u,f=h*h,d=f*h,v=e*c,x=v-c,_=-2*d+3*f,p=d-f,A=1-_,R=p-f+h;for(let M=0;M!==a;M++){const F=o[x+M+a],I=o[x+M+l]*u,U=o[v+M+a],W=o[v+M]*u;s[M]=A*F+R*I+_*U+p*W}return s}}const lA=new Ui;class cA extends Zm{interpolate_(e,t,i,r){const s=super.interpolate_(e,t,i,r);return lA.fromArray(s).normalize().toArray(s),s}}const $n={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ns={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Xd={9728:Un,9729:Hn,9984:vm,9985:Wa,9986:vo,9987:tr},jd={33071:vr,33648:ll,10497:zs},Ic={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Vu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},pr={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},uA={CUBICSPLINE:void 0,LINEAR:Ho,STEP:zo},Dc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function hA(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new Tl({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Di})),n.DefaultMaterial}function zr(n,e,t){for(const i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Zi(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function fA(n,e,t){let i=!1,r=!1,s=!1;for(let c=0,u=e.length;c<u;c++){const h=e[c];if(h.POSITION!==void 0&&(i=!0),h.NORMAL!==void 0&&(r=!0),h.COLOR_0!==void 0&&(s=!0),i&&r&&s)break}if(!i&&!r&&!s)return Promise.resolve(n);const o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];if(i){const f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):n.attributes.position;o.push(f)}if(r){const f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):n.attributes.normal;a.push(f)}if(s){const f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):n.attributes.color;l.push(f)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){const u=c[0],h=c[1],f=c[2];return i&&(n.morphAttributes.position=u),r&&(n.morphAttributes.normal=h),s&&(n.morphAttributes.color=f),n.morphTargetsRelative=!0,n})}function dA(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,r=t.length;i<r;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function pA(n){let e;const t=n.extensions&&n.extensions[St.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Uc(t.attributes):e=n.indices+":"+Uc(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,r=n.targets.length;i<r;i++)e+=":"+Uc(n.targets[i]);return e}function Uc(n){let e="";const t=Object.keys(n).sort();for(let i=0,r=t.length;i<r;i++)e+=t[i]+":"+n[t[i]]+";";return e}function ku(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function mA(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const gA=new mt;class _A{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new VT,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,r=-1,s=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(a)===!0;const l=a.match(/Version\/(\d+)/);r=i&&l?parseInt(l[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&r<17||s&&o<98?this.textureLoader=new Ay(this.options.manager):this.textureLoader=new Dy(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Al(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){const a={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:i,userData:{}};return zr(s,a,r),Zi(a,r),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(const l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){const o=t[r].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let r=0,s=e.length;r<s;r++){const o=e[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const r=i.clone(),s=(o,a)=>{const l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(const[c,u]of o.children.entries())s(u,a.children[c])};return s(i,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const r=e(t[i]);if(r)return r}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let r=0;r<t.length;r++){const s=e(t[r]);s&&i.push(s)}return i}getDependency(e,t){const i=e+":"+t;let r=this.cache.get(i);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(i,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,o){return i.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[St.KHR_BINARY_GLTF].body);const r=this.options;return new Promise(function(s,o){i.load(Lo.resolveURL(t.uri,r.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const r=t.byteLength||0,s=t.byteOffset||0;return i.slice(s,s+r)})}loadAccessor(e){const t=this,i=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){const o=Ic[r.type],a=Ns[r.componentType],l=r.normalized===!0,c=new a(r.count*o);return Promise.resolve(new Jt(c,o,l))}const s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(o){const a=o[0],l=Ic[r.type],c=Ns[r.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,f=r.byteOffset||0,d=r.bufferView!==void 0?i.bufferViews[r.bufferView].byteStride:void 0,v=r.normalized===!0;let x,_;if(d&&d!==h){const p=Math.floor(f/d),A="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+p+":"+r.count;let R=t.cache.get(A);R||(x=new c(a,p*d,r.count*d/u),R=new ty(x,d/u),t.cache.add(A,R)),_=new mh(R,l,f%d/u,v)}else a===null?x=new c(r.count*l):x=new c(a,f,r.count*l),_=new Jt(x,l,v);if(r.sparse!==void 0){const p=Ic.SCALAR,A=Ns[r.sparse.indices.componentType],R=r.sparse.indices.byteOffset||0,M=r.sparse.values.byteOffset||0,F=new A(o[1],R,r.sparse.count*p),I=new c(o[2],M,r.sparse.count*l);a!==null&&(_=new Jt(_.array.slice(),_.itemSize,_.normalized)),_.normalized=!1;for(let U=0,W=F.length;U<W;U++){const w=F[U];if(_.setX(w,I[U*l]),l>=2&&_.setY(w,I[U*l+1]),l>=3&&_.setZ(w,I[U*l+2]),l>=4&&_.setW(w,I[U*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}_.normalized=v}return _})}loadTexture(e){const t=this.json,i=this.options,s=t.textures[e].source,o=t.images[s];let a=this.textureLoader;if(o.uri){const l=i.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,i){const r=this,s=this.json,o=s.textures[e],a=s.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,i).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const f=(s.samplers||{})[o.sampler]||{};return u.magFilter=Xd[f.magFilter]||Hn,u.minFilter=Xd[f.minFilter]||tr,u.wrapS=jd[f.wrapS]||zs,u.wrapT=jd[f.wrapT]||zs,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Un&&u.minFilter!==Hn,r.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const i=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const o=r.images[e],a=self.URL||self.webkitURL;let l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=i.getDependency("bufferView",o.bufferView).then(function(h){c=!0;const f=new Blob([h],{type:o.mimeType});return l=a.createObjectURL(f),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(h){return new Promise(function(f,d){let v=f;t.isImageBitmapLoader===!0&&(v=function(x){const _=new mn(x);_.needsUpdate=!0,f(_)}),t.load(Lo.resolveURL(h,s.path),v,void 0,d)})}).then(function(h){return c===!0&&a.revokeObjectURL(l),Zi(h,o),h.userData.mimeType=o.mimeType||mA(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,i,r){const s=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),s.extensions[St.KHR_TEXTURE_TRANSFORM]){const a=i.extensions!==void 0?i.extensions[St.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const l=s.associations.get(o);o=s.extensions[St.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,l)}}return r!==void 0&&(o.colorSpace=r),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+i.uuid;let l=this.cache.get(a);l||(l=new Rs,Gn.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(a,l)),i=l}else if(e.isLine){const a="LineBasicMaterial:"+i.uuid;let l=this.cache.get(a);l||(l=new Qr,Gn.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(a,l)),i=l}if(r||s||o){let a="ClonedMaterial:"+i.uuid+":";r&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=i.clone(),s&&(l.vertexColors=!0),o&&(l.flatShading=!0),r&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return Tl}loadMaterial(e){const t=this,i=this.json,r=this.extensions,s=i.materials[e];let o;const a={},l=s.extensions||{},c=[];if(l[St.KHR_MATERIALS_UNLIT]){const h=r[St.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),c.push(h.extendParams(a,s,t))}else{const h=s.pbrMetallicRoughness||{};if(a.color=new tt(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){const f=h.baseColorFactor;a.color.setRGB(f[0],f[1],f[2],Nn),a.opacity=f[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",h.baseColorTexture,ln)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=Yn);const u=s.alphaMode||Dc.OPAQUE;if(u===Dc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Dc.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Ti&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new lt(1,1),s.normalTexture.scale!==void 0)){const h=s.normalTexture.scale;a.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&o!==Ti&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Ti){const h=s.emissiveFactor;a.emissive=new tt().setRGB(h[0],h[1],h[2],Nn)}return s.emissiveTexture!==void 0&&o!==Ti&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,ln)),Promise.all(c).then(function(){const h=new o(a);return s.name&&(h.name=s.name),Zi(h,s),t.associations.set(h,{materials:e}),s.extensions&&zr(r,h,s),h})}createUniqueName(e){const t=Bt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,r=this.primitiveCache;function s(a){return i[St.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return $d(l,a,t)})}const o=[];for(let a=0,l=e.length;a<l;a++){const c=e[a],u=pA(c),h=r[u];if(h)o.push(h.promise);else{let f;c.extensions&&c.extensions[St.KHR_DRACO_MESH_COMPRESSION]?f=s(c):f=$d(new sn,c,t),r[u]={primitive:c,promise:f},o.push(f)}}return Promise.all(o)}loadMesh(e){const t=this,i=this.json,r=this.extensions,s=i.meshes[e],o=s.primitives,a=[];for(let l=0,c=o.length;l<c;l++){const u=o[l].material===void 0?hA(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let d=0,v=u.length;d<v;d++){const x=u[d],_=o[d];let p;const A=c[d];if(_.mode===$n.TRIANGLES||_.mode===$n.TRIANGLE_STRIP||_.mode===$n.TRIANGLE_FAN||_.mode===void 0)p=s.isSkinnedMesh===!0?new iy(x,A):new cn(x,A),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),_.mode===$n.TRIANGLE_STRIP?p.geometry=Gd(p.geometry,Rm):_.mode===$n.TRIANGLE_FAN&&(p.geometry=Gd(p.geometry,Iu));else if(_.mode===$n.LINES)p=new Wo(x,A);else if(_.mode===$n.LINE_STRIP)p=new vh(x,A);else if(_.mode===$n.LINE_LOOP)p=new cy(x,A);else if(_.mode===$n.POINTS)p=new Ka(x,A);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+_.mode);Object.keys(p.geometry.morphAttributes).length>0&&dA(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),Zi(p,s),_.extensions&&zr(r,p,_),t.assignFinalMaterial(p),h.push(p)}for(let d=0,v=h.length;d<v;d++)t.associations.set(h[d],{meshes:e,primitives:d});if(h.length===1)return s.extensions&&zr(r,h[0],s),h[0];const f=new Ai;s.extensions&&zr(r,f,s),t.associations.set(f,{meshes:e});for(let d=0,v=h.length;d<v;d++)f.add(h[d]);return f})}loadCamera(e){let t;const i=this.json.cameras[e],r=i[i.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new In(Pm.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):i.type==="orthographic"&&(t=new Mh(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Zi(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let r=0,s=t.joints.length;r<s;r++)i.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(r){const s=r.pop(),o=r,a=[],l=[];for(let c=0,u=o.length;c<u;c++){const h=o[c];if(h){a.push(h);const f=new mt;s!==null&&f.fromArray(s.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new gh(a,l)})}loadAnimation(e){const t=this.json,i=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let h=0,f=r.channels.length;h<f;h++){const d=r.channels[h],v=r.samplers[d.sampler],x=d.target,_=x.node,p=r.parameters!==void 0?r.parameters[v.input]:v.input,A=r.parameters!==void 0?r.parameters[v.output]:v.output;x.node!==void 0&&(o.push(this.getDependency("node",_)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",A)),c.push(v),u.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){const f=h[0],d=h[1],v=h[2],x=h[3],_=h[4],p=[];for(let A=0,R=f.length;A<R;A++){const M=f[A],F=d[A],I=v[A],U=x[A],W=_[A];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();const w=i._createAnimationTracks(M,F,I,U,W);if(w)for(let E=0;E<w.length;E++)p.push(w[E])}return new xy(s,void 0,p)})}createNodeMesh(e){const t=this.json,i=this,r=t.nodes[e];return r.mesh===void 0?null:i.getDependency("mesh",r.mesh).then(function(s){const o=i._getNodeRef(i.meshCache,r.mesh,s);return r.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=r.weights.length;l<c;l++)a.morphTargetInfluences[l]=r.weights[l]}),o})}loadNode(e){const t=this.json,i=this,r=t.nodes[e],s=i._loadNodeShallow(e),o=[],a=r.children||[];for(let c=0,u=a.length;c<u;c++)o.push(i.getDependency("node",a[c]));const l=r.skin===void 0?Promise.resolve(null):i.getDependency("skin",r.skin);return Promise.all([s,Promise.all(o),l]).then(function(c){const u=c[0],h=c[1],f=c[2];f!==null&&u.traverse(function(d){d.isSkinnedMesh&&d.bind(f,gA)});for(let d=0,v=h.length;d<v;d++)u.add(h[d]);return u})}_loadNodeShallow(e){const t=this.json,i=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],o=s.name?r.createUniqueName(s.name):"",a=[],l=r._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),s.camera!==void 0&&a.push(r.getDependency("camera",s.camera).then(function(c){return r._getNodeRef(r.cameraCache,s.camera,c)})),r._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(s.isBone===!0?u=new km:c.length>1?u=new Ai:c.length===1?u=c[0]:u=new Qt,u!==c[0])for(let h=0,f=c.length;h<f;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=o),Zi(u,s),s.extensions&&zr(i,u,s),s.matrix!==void 0){const h=new mt;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);return r.associations.has(u)||r.associations.set(u,{}),r.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],r=this,s=new Ai;i.name&&(s.name=r.createUniqueName(i.name)),Zi(s,i),i.extensions&&zr(t,s,i);const o=i.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(r.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,h=l.length;u<h;u++)s.add(l[u]);const c=u=>{const h=new Map;for(const[f,d]of r.associations)(f instanceof Gn||f instanceof mn)&&h.set(f,d);return u.traverse(f=>{const d=r.associations.get(f);d!=null&&h.set(f,d)}),h};return r.associations=c(s),s})}_createAnimationTracks(e,t,i,r,s){const o=[],a=e.name?e.name:e.uuid,l=[];pr[s.path]===pr.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(a);let c;switch(pr[s.path]){case pr.weights:c=js;break;case pr.rotation:c=$s;break;case pr.position:case pr.scale:c=qs;break;default:switch(i.itemSize){case 1:c=js;break;case 2:case 3:default:c=qs;break}break}const u=r.interpolation!==void 0?uA[r.interpolation]:Ho,h=this._getArrayFromAccessor(i);for(let f=0,d=l.length;f<d;f++){const v=new c(l[f]+"."+pr[s.path],t.array,h,u);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),o.push(v)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=ku(t.constructor),r=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)r[s]=t[s]*i;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const r=this instanceof $s?cA:Zm;return new r(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function vA(n,e,t){const i=e.attributes,r=new pi;if(i.POSITION!==void 0){const a=t.json.accessors[i.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(r.set(new k(l[0],l[1],l[2]),new k(c[0],c[1],c[2])),a.normalized){const u=ku(Ns[a.componentType]);r.min.multiplyScalar(u),r.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const a=new k,l=new k;for(let c=0,u=s.length;c<u;c++){const h=s[c];if(h.POSITION!==void 0){const f=t.json.accessors[h.POSITION],d=f.min,v=f.max;if(d!==void 0&&v!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(v[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(v[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(v[2]))),f.normalized){const x=ku(Ns[f.componentType]);l.multiplyScalar(x)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(a)}n.boundingBox=r;const o=new Ni;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,n.boundingSphere=o}function $d(n,e,t){const i=e.attributes,r=[];function s(o,a){return t.getDependency("accessor",o).then(function(l){n.setAttribute(a,l)})}for(const o in i){const a=Vu[o]||o.toLowerCase();a in n.attributes||r.push(s(i[o],a))}if(e.indices!==void 0&&!n.index){const o=t.getDependency("accessor",e.indices).then(function(a){n.setIndex(a)});r.push(o)}return Rt.workingColorSpace!==Nn&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Rt.workingColorSpace}" not supported.`),Zi(n,e),vA(n,e,t),Promise.all(r).then(function(){return e.targets!==void 0?fA(n,e.targets,t):n})}function xA(n,e){let t=0;for(let i=0;i<e.length;i+=3){const r=e[i]*3,s=e[i+1]*3,o=e[i+2]*3,a=n[r],l=n[r+1],c=n[r+2],u=n[s],h=n[s+1],f=n[s+2],d=n[o],v=n[o+1],x=n[o+2];t+=a*(h*x-f*v)-l*(u*x-f*d)+c*(u*v-h*d)}return Math.abs(t)/6}function yA(n,e,t){const i=n.getAttribute("position"),r=new Float32Array(i.array);let s;if(n.index)s=new Uint32Array(n.index.array);else{s=new Uint32Array(i.count);for(let a=0;a<s.length;a++)s[a]=a}const o=r.length/3;return{id:`part-${Math.random().toString(36).slice(2,9)}`,name:e,kind:t,positions:r,original:r.slice(),indices:s,zoneOfVertex:new Uint8Array(o),stress:new Float32Array(o)}}function qd(n){const e=[];return n.updateMatrixWorld(!0),n.traverse(t=>{const i=t;if(i.isMesh&&i.geometry){const r=i.geometry.clone().applyMatrix4(i.matrixWorld);for(const o of Object.keys(r.attributes))o!=="position"&&r.deleteAttribute(o);const s=r.index?r.toNonIndexed():r;e.push(s)}}),e}async function MA(n){var s;const e=((s=n.name.split(".").pop())==null?void 0:s.toLowerCase())??"",t=await n.arrayBuffer();let i;if(e==="stl")i=new LT().parse(t);else if(e==="obj"){const o=new TextDecoder().decode(t),a=new OT().parse(o),l=qd(a);if(!l.length)throw new Error("OBJ 中没有网格数据");i=l.length===1?l[0]:zd(l,!1)}else if(e==="gltf"||e==="glb"){const o=await new BT().parseAsync(t,""),a=qd(o.scene);if(!a.length)throw new Error("GLTF 中没有网格数据");i=a.length===1?a[0]:zd(a,!1)}else throw new Error(`不支持的格式: .${e}(支持 STL / OBJ / GLTF / GLB)`);const r=yA(i,n.name,"solid");return SA(r),r}function SA(n){const e=n.positions,t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let o=0;o<e.length;o+=3)for(let a=0;a<3;a++)t[a]=Math.min(t[a],e[o+a]),i[a]=Math.max(i[a],e[o+a]);const r=Math.max(i[0]-t[0],i[1]-t[1],i[2]-t[2]);if(!(r>0))return;const s=4/r;if(!(Math.abs(s-1)<.05)){for(let o=0;o<e.length;o+=3)e[o]*=s,e[o+1]*=s,e[o+2]*=s;n.original.set(n.positions)}}function Jm(n,e){const t=n.original;let i=1/0,r=-1/0;for(let a=0;a<t.length;a+=3)t[a]<i&&(i=t[a]),t[a]>r&&(r=t[a]);const s=Math.max(1e-9,r-i),o=n.zoneOfVertex;for(let a=0;a<o.length;a++){const l=(t[a*3]-i)/s;let c=e.length-1;for(let u=0;u<e.length;u++)if(l>=e[u].xMin&&l<=e[u].xMax){c=u;break}o[a]=c}}function Cl(n,e){const t=URL.createObjectURL(n),i=document.createElement("a");i.href=t,i.download=e,i.click(),setTimeout(()=>URL.revokeObjectURL(t),5e3)}function bA(n,e,t){const i=[n,...e];let r=0;for(const v of i)r+=v.indices.length/3;const s=new ArrayBuffer(84+r*50),o=new DataView(s);o.setUint32(80,r,!0);let a=84;const l=new k,c=new k,u=new k,h=new k,f=new k,d=new k;for(const v of i){const x=v.positions,_=v.indices;for(let p=0;p<_.length;p+=3){for(let A=0;A<3;A++){const R=_[p+A]*3;A===0&&l.set(x[R],x[R+1],x[R+2]),A===1&&c.set(x[R],x[R+1],x[R+2]),A===2&&u.set(x[R],x[R+1],x[R+2])}f.subVectors(c,l),d.subVectors(u,l),h.crossVectors(f,d).normalize(),o.setFloat32(a,h.x,!0),o.setFloat32(a+4,h.y,!0),o.setFloat32(a+8,h.z,!0),a+=12;for(const A of[l,c,u])o.setFloat32(a,A.x,!0),o.setFloat32(a+4,A.y,!0),o.setFloat32(a+8,A.z,!0),a+=12;o.setUint16(a,0,!0),a+=2}}Cl(new Blob([s],{type:"model/stl"}),t)}function EA(n,e){const t=["# deformed frame export"];let i=1;for(const r of n){t.push(`o ${r.name}`);const s=r.positions;for(let a=0;a<s.length;a+=3)t.push(`v ${s[a].toFixed(6)} ${s[a+1].toFixed(6)} ${s[a+2].toFixed(6)}`);const o=r.indices;for(let a=0;a<o.length;a+=3)t.push(`f ${o[a]+i} ${o[a+1]+i} ${o[a+2]+i}`);i+=s.length/3}Cl(new Blob([t.join(`
`)],{type:"text/plain"}),e)}function TA(n,e,t){const i=["part,vertex,x,y,z,stress_MPa,zone"];for(const r of n){const s=r.positions,o=r.stress;for(let a=0;a<o.length;a++){const l=a*3;i.push(`${r.name},${a},${s[l].toFixed(5)},${s[l+1].toFixed(5)},${s[l+2].toFixed(5)},${o[a].toFixed(2)},${e[r.zoneOfVertex[a]]??r.zoneOfVertex[a]}`)}}Cl(new Blob([i.join(`
`)],{type:"text/csv"}),t)}function AA(n,e){Cl(new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),e)}const Wn={parts:[],fileName:""},ce=vl({loaded:!1,loading:!1,computing:!1,error:"",zones:[{id:1,name:"前舱吸能区",xMin:0,xMax:.35,yieldStrength:250,color:"#e0a32e"},{id:2,name:"乘员舱高强钢",xMin:.35,xMax:.75,yieldStrength:550,color:"#3e8fe0"},{id:3,name:"后舱结构区",xMin:.75,xMax:1,yieldStrength:320,color:"#4fc06a"}],presetIndex:0,impulse:8e3,collisions:[],stats:{vertexCount:0,triangleCount:0,initialVolume:0,currentVolume:0,maxStress:0,maxStressPoint:[0,0,0],maxStressZone:"",exceededVertices:0,lastComputeMs:0,collisionCount:0},showGhost:!1,shellOpacity:.32,showZoneColors:!1,clipEnabled:!1,clipAxis:"x",clipPos:0,clipRange:[0,0],stressCap:0,viewVersion:0});class wA{constructor(){sa(this,"worker",null);sa(this,"seq",0);sa(this,"pending",new Map)}ensure(){return this.worker||(this.worker=new Worker(new URL("/assets/deform.worker-CrbSekQL.js",import.meta.url),{type:"module"}),this.worker.onmessage=e=>{const t=e.data,i=this.pending.get(t.id);i&&(this.pending.delete(t.id),i(t))}),this.worker}call(e,t,i=[]){const r=this.ensure(),s=++this.seq;return new Promise(o=>{this.pending.set(s,o),r.postMessage({id:s,type:e,...t},i)})}async init(e){const t=e.map(r=>({name:r.name,positions:r.positions.slice(),indices:r.indices,zoneOfVertex:r.zoneOfVertex.slice()})),i=[];for(const r of t)i.push(r.positions.buffer);return this.call("init",{parts:t,yieldStrengths:Yd()},i)}collide(e,t){return this.call("collide",{dir:e,impulse:t})}setZones(e){const t=e.map(i=>i.zoneOfVertex.slice());return this.call("setZones",{zones:t,yieldStrengths:Yd()},t.map(i=>i.buffer))}reset(){return this.call("reset",{})}dispose(){var e;(e=this.worker)==null||e.terminate(),this.worker=null}}const Pl=new wA;function Yd(){return ce.zones.map(n=>n.yieldStrength)}function Th(n){var t;for(let i=0;i<Wn.parts.length;i++){const r=Wn.parts[i];r.positions.set(n.positions[i]),r.stress.set(n.stress[i])}const e=ce.stats;e.currentVolume=n.volumes.reduce((i,r)=>i+r,0),e.maxStress=n.maxStress,e.maxStressPoint=n.maxPoint,e.maxStressZone=((t=ce.zones[n.maxZone])==null?void 0:t.name)??"",e.exceededVertices=n.exceeded,e.lastComputeMs=n.timeMs,ce.viewVersion++}async function Kd(n,e){ce.loading=!0,ce.error="";try{for(const r of n)Jm(r,ce.zones);Wn.parts=n,Wn.fileName=e,ce.collisions=[],ce.stats.collisionCount=0;const t=await Pl.init(n);Th(t);const i=ce.stats;i.vertexCount=n.reduce((r,s)=>r+s.positions.length/3,0),i.triangleCount=n.reduce((r,s)=>r+s.indices.length/3,0),i.initialVolume=n.reduce((r,s)=>r+xA(s.original,s.indices),0),i.currentVolume=i.initialVolume,i.maxStress=0,Ja(),ce.loaded=!0}catch(t){ce.error=t instanceof Error?t.message:String(t)}finally{ce.loading=!1}}async function Zd(){if(!(!ce.loaded||ce.computing)){ce.computing=!0;try{const n=mm[ce.presetIndex],e=await Pl.collide(n.dir,ce.impulse);Th(e),ce.stats.collisionCount++,ce.collisions.push({id:ce.collisions.length+1,presetName:n.name,dir:n.dir,impulse:ce.impulse,maxStress:e.maxStress,timeMs:e.timeMs})}finally{ce.computing=!1}}}async function Jd(){if(ce.loaded){for(const n of Wn.parts)Jm(n,ce.zones);await Pl.setZones(Wn.parts),ce.viewVersion++}}async function Qd(){if(!(!ce.loaded||ce.computing)){ce.computing=!0;try{const n=await Pl.reset();Th(n),ce.collisions=[],ce.stats.collisionCount=0}finally{ce.computing=!1}}}function Ja(){if(!Wn.parts.length)return;const n={x:0,y:1,z:2}[ce.clipAxis];let e=1/0,t=-1/0;for(const i of Wn.parts){const r=i.positions;for(let s=n;s<r.length;s+=3)r[s]<e&&(e=r[s]),r[s]>t&&(t=r[s])}ce.clipRange=[e,t],ce.clipPos=Math.min(t,Math.max(e,ce.clipPos||(e+t)/2))}const RA="modulepreload",CA=function(n){return"/"+n},ep={},PA=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let o=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=o(t.map(c=>{if(c=CA(c),c in ep)return;ep[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":RA,u||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),u)return new Promise((d,v)=>{f.addEventListener("load",d),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})};async function LA(n={}){var Uh,Nh,Fh;var e,t=n,i=!!globalThis.window,r=!!globalThis.WorkerGlobalScope,s=((Nh=(Uh=globalThis.process)==null?void 0:Uh.versions)==null?void 0:Nh.node)&&((Fh=globalThis.process)==null?void 0:Fh.type)!="renderer";if(s){const{createRequire:m}=await PA(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]);var o=m(import.meta.url)}var a=!1;t.setup=function(){if(a)return;a=!0,t.initTBB();function m(D,G,le=(xe=>xe)){if(G)for(let xe of G)D.push_back(le(xe));return D}function g(D,G=(le=>le)){const le=[],xe=D.size();for(let $e=0;$e<xe;$e++)le.push(G(D.get($e)));return le}function b(D,G=(le=>le)){const le=[],xe=D.size();for(let $e=0;$e<xe;$e++){const ht=D.get($e),Et=ht.size(),Xt=[];for(let It=0;It<Et;It++)Xt.push(G(ht.get(It)));le.push(Xt)}return le}function P(D){return D[0].length<3&&(D=[D]),m(new t.Vector2_vec2,D,G=>m(new t.Vector_vec2,G,le=>le instanceof Array?{x:le[0],y:le[1]}:le))}function O(D){for(let G=0;G<D.size();G++)D.get(G).delete();D.delete()}function q(D){return D[0]instanceof Array?{x:D[0][0],y:D[0][1]}:typeof D[0]=="number"?{x:D[0]||0,y:D[1]||0}:D[0]}function Y(D){return D[0]instanceof Array?{x:D[0][0],y:D[0][1],z:D[0][2]}:typeof D[0]=="number"?{x:D[0]||0,y:D[1]||0,z:D[2]||0}:D[0]}function ee(D){return D=="EvenOdd"?0:D=="NonZero"?1:D=="Negative"?3:2}function me(D){return D=="Round"?1:D=="Miter"?2:0}const Ee=t.CrossSection;function Pe(D,G="Positive"){if(D instanceof Ee)return D;{const le=P(D),xe=new Ee(le,ee(G));return O(le),xe}}t.CrossSection.prototype.translate=function(...D){return this._Translate(q(D))},t.CrossSection.prototype.scale=function(D){return typeof D=="number"?this._Scale({x:D,y:D}):this._Scale(q([D]))},t.CrossSection.prototype.mirror=function(D){return this._Mirror(q([D]))},t.CrossSection.prototype.warp=function(D){const G=Pr(function(xe){const $e=K(xe,"double"),ht=K(xe+8,"double"),Et=[$e,ht];D(Et),C(xe,Et[0],"double"),C(xe+8,Et[1],"double")},"vi"),le=this._Warp(G);return Lr(G),le},t.CrossSection.prototype.decompose=function(){const D=this._Decompose(),G=g(D);return D.delete(),G},t.CrossSection.prototype.bounds=function(){const D=this._Bounds();return{min:["x","y"].map(G=>D.min[G]),max:["x","y"].map(G=>D.max[G])}},t.CrossSection.prototype.offset=function(D,G="Round",le=2,xe=0){return this._Offset(D,me(G),le,xe)},t.CrossSection.prototype.simplify=function(D=1e-6){return this._Simplify(D)},t.CrossSection.prototype.extrude=function(D,G=0,le=0,xe=[1,1],$e=!1){xe=q([xe]);const ht=t._Extrude(this._ToPolygons(),D,G,le,xe);return $e?ht.translate([0,0,-D/2]):ht},t.CrossSection.prototype.revolve=function(D=0,G=360){return t._Revolve(this._ToPolygons(),D,G)},t.CrossSection.prototype.add=function(D){return this._add(Pe(D))},t.CrossSection.prototype.subtract=function(D){return this._subtract(Pe(D))},t.CrossSection.prototype.intersect=function(D){return this._intersect(Pe(D))},t.CrossSection.prototype.toPolygons=function(){const D=this._ToPolygons(),G=b(D,le=>[le.x,le.y]);return D.delete(),G},t.Manifold.prototype.smoothOut=function(D=52.5,G=0){return this._SmoothOut(D,G)},t.Manifold.prototype.warp=function(D){const G=Pr(function($e){const ht=K($e,"double"),Et=K($e+8,"double"),Xt=K($e+16,"double"),It=[ht,Et,Xt];D(It),C($e,It[0],"double"),C($e+8,It[1],"double"),C($e+16,It[2],"double")},"vi"),le=this._Warp(G);Lr(G);const xe=le.status();if(xe!=="NoError")throw new t.ManifoldError(xe);return le},t.Manifold.prototype.warpBatch=function(D){const G=Pr(function($e,ht){const Et=t.HEAPF64??B;if(!Et)throw new Error("WASM heap is not initialized (HEAPF64 unavailable)");const Xt=new Float64Array(Et.buffer,$e,ht*3);D(Xt,ht)},"vii"),le=this._WarpBatch(G);Lr(G);const xe=le.status();if(xe!=="NoError")throw new t.ManifoldError(xe);return le},t.Manifold.prototype.calculateNormals=function(D=0,G=52.5){return this._CalculateNormals(D,G)},t.Manifold.prototype.smoothByNormals=function(D=0){return this._SmoothByNormals(D)},t.Manifold.prototype.setProperties=function(D,G){const le=this.numProp(),xe=Pr(function(ht,Et,Xt){const It=[];for(let Yt=0;Yt<D;++Yt)It[Yt]=K(ht+8*Yt,"double");const gi=[];for(let Yt=0;Yt<3;++Yt)gi[Yt]=K(Et+8*Yt,"double");const ar=[];for(let Yt=0;Yt<le;++Yt)ar[Yt]=K(Xt+8*Yt,"double");G(It,gi,ar);for(let Yt=0;Yt<D;++Yt)C(ht+8*Yt,It[Yt],"double")},"viii"),$e=this._SetProperties(D,xe);return Lr(xe),$e},t.Manifold.prototype.translate=function(...D){return this._Translate(Y(D))},t.Manifold.prototype.rotate=function(D,G,le){return Array.isArray(D)?this._Rotate(...D):this._Rotate(D,G||0,le||0)},t.Manifold.prototype.scale=function(D){return typeof D=="number"?this._Scale({x:D,y:D,z:D}):this._Scale(Y([D]))},t.Manifold.prototype.mirror=function(D){return this._Mirror(Y([D]))},t.Manifold.prototype.trimByPlane=function(D,G=0){return this._TrimByPlane(Y([D]),G)},t.Manifold.prototype.slice=function(D=0){const G=this._Slice(D),le=new Ee(G,ee("Positive"));return O(G),le},t.Manifold.prototype.project=function(){const D=this._Project(),G=new Ee(D,ee("Positive"));return O(D),G},t.Manifold.prototype.rayCast=function(D,G){const le=this._RayCast(Y([D]),Y([G])),xe=g(le,$e=>({faceID:$e.faceID,distance:$e.distance,position:["x","y","z"].map(ht=>$e.position[ht]),normal:["x","y","z"].map(ht=>$e.normal[ht])}));return le.delete(),xe},t.Manifold.prototype.split=function(D){const G=this._Split(D),le=g(G);return G.delete(),le},t.Manifold.prototype.splitByPlane=function(D,G=0){const le=this._SplitByPlane(Y([D]),G),xe=g(le);return le.delete(),xe},t.Manifold.prototype.decompose=function(){const D=this._Decompose(),G=g(D);return D.delete(),G},t.Manifold.prototype.boundingBox=function(){const D=this._boundingBox();return{min:["x","y","z"].map(G=>D.min[G]),max:["x","y","z"].map(G=>D.max[G])}},t.Manifold.prototype.simplify=function(D=0){return this._Simplify(D)};class Ie{constructor({numProp:G=3,triVerts:le=new Uint32Array,vertProperties:xe=new Float32Array,mergeFromVert:$e,mergeToVert:ht,runIndex:Et,runOriginalID:Xt,faceID:It,halfedgeTangent:gi,runTransform:ar,runFlags:Yt,tolerance:Bl=0}={}){this.numProp=G,this.triVerts=le,this.vertProperties=xe,this.mergeFromVert=$e,this.mergeToVert=ht,this.runIndex=Et,this.runOriginalID=Xt,this.faceID=It,this.halfedgeTangent=gi,this.runTransform=ar,this.runFlags=Yt,this.tolerance=Bl}get numTri(){return this.triVerts.length/3}get numVert(){return this.vertProperties.length/this.numProp}get numRun(){return this.runOriginalID.length}merge(){const{changed:G,mesh:le}=t._Merge(this);return Object.assign(this,{...le}),G}verts(G){return this.triVerts.subarray(3*G,3*(G+1))}position(G){return this.vertProperties.subarray(this.numProp*G,this.numProp*G+3)}extras(G){return this.vertProperties.subarray(this.numProp*G+3,this.numProp*(G+1))}tangent(G){return this.halfedgeTangent.subarray(4*G,4*(G+1))}transform(G){const le=new Array(16);for(const xe of[0,1,2,3])for(const $e of[0,1,2])le[4*xe+$e]=this.runTransform[12*G+3*xe+$e];return le[15]=1,le}backside(G){return this.runFlags!=null&&G<this.runFlags.length&&(this.runFlags[G]&1)!==0}hasNormals(G){return this.runFlags!=null&&G<this.runFlags.length&&(this.runFlags[G]&2)!==0}}t.Mesh=Ie,t.Manifold.prototype.getMesh=function(D=-1){return new Ie(this._GetMeshJS(D))},t.ManifoldError=function(G,...le){let xe="Unknown error";switch(G){case"NonFiniteVertex":xe="Non-finite vertex";break;case"NotManifold":xe="Not manifold";break;case"VertexOutOfBounds":xe="Vertex index out of bounds";break;case"PropertiesWrongLength":xe="Properties have wrong length";break;case"MissingPositionProperties":xe="Less than three properties";break;case"MergeVectorsDifferentLengths":xe="Merge vectors have different lengths";break;case"MergeIndexOutOfBounds":xe="Merge index out of bounds";break;case"TransformWrongLength":xe="Transform vector has wrong length";break;case"RunIndexWrongLength":xe="Run index vector has wrong length";break;case"FaceIDWrongLength":xe="Face ID vector has wrong length";break;case"InvalidConstruction":xe="Manifold constructed with invalid parameters";break;case"ResultTooLarge":xe="Result exceeds maximum size";break;case"InvalidTangents":xe="Invalid halfedge tangents";break}const $e=Error.apply(this,[xe,...le]);$e.name=this.name="ManifoldError",this.message=$e.message,this.stack=$e.stack,this.code=G},t.ManifoldError.prototype=Object.create(Error.prototype,{constructor:{value:t.ManifoldError,writable:!0,configurable:!0}}),t.CrossSection=function(D,G="Positive"){const le=P(D),xe=new Ee(le,ee(G));return O(le),xe},t.CrossSection.ofPolygons=function(D,G="Positive"){return new t.CrossSection(D,G)},t.CrossSection.square=function(...D){let G;D.length==0?G={x:1,y:1}:typeof D[0]=="number"?G={x:D[0],y:D[0]}:G=q(D);const le=D[1]||!1;return t._Square(G,le)},t.CrossSection.circle=function(D,G=0){return t._Circle(D,G)};function ze(D){return function(...G){G.length==1&&(G=G[0]);const le=new t.Vector_crossSection;for(const $e of G)le.push_back(Pe($e));const xe=t["_crossSection"+D](le);return le.delete(),xe}}t.CrossSection.compose=ze("Compose"),t.CrossSection.union=ze("UnionN"),t.CrossSection.difference=ze("DifferenceN"),t.CrossSection.intersection=ze("IntersectionN");function Ye(D,G){m(D,G,le=>le instanceof Array?{x:le[0],y:le[1]}:le)}t.CrossSection.hull=function(...D){D.length==1&&(D=D[0]);let G=new t.Vector_vec2;for(const xe of D)if(xe instanceof Ee)t._crossSectionCollectVertices(G,xe);else if(xe instanceof Array&&xe.length==2&&typeof xe[0]=="number")G.push_back({x:xe[0],y:xe[1]});else if(xe.x)G.push_back(xe);else{const ht=xe[0].length==2&&typeof xe[0][0]=="number"||xe[0].x?[xe]:xe;for(const Et of ht)Ye(G,Et)}const le=t._crossSectionHullPoints(G);return G.delete(),le},t.CrossSection.prototype=Object.create(Ee.prototype),Object.defineProperty(t.CrossSection,Symbol.hasInstance,{get:()=>D=>D instanceof Ee});const Je=t.Manifold;t.Manifold=function(D){const G=new Je(D),le=G.status();if(le!=="NoError")throw new t.ManifoldError(le);return G},t.Manifold.ofMesh=function(D){return new t.Manifold(D)},t.Manifold.tetrahedron=function(){return t._Tetrahedron()},t.Manifold.cube=function(...D){let G;D.length==0?G={x:1,y:1,z:1}:typeof D[0]=="number"?G={x:D[0],y:D[0],z:D[0]}:G=Y(D);const le=D[1]||!1;return t._Cube(G,le)},t.Manifold.cylinder=function(D,G,le=-1,xe=0,$e=!1){return t._Cylinder(D,G,le,xe,$e)},t.Manifold.sphere=function(D,G=0){return t._Sphere(D,G)},t.Manifold.smooth=function(D,G=[]){const le=new t.Vector_smoothness;m(le,G);const xe=t._Smooth(D,le);return le.delete(),xe},t.Manifold.extrude=function(D,G,le=0,xe=0,$e=[1,1],ht=!1){return(D instanceof Ee?D:t.CrossSection(D,"Positive")).extrude(G,le,xe,$e,ht)},t.Manifold.revolve=function(D,G=0,le=360){return(D instanceof Ee?D:t.CrossSection(D,"Positive")).revolve(G,le)},t.Manifold.reserveIDs=function(D){return t._ReserveIDs(D)};function st(D){return function(...G){G.length==1&&(G=G[0]);const le=new t.Vector_manifold;for(const $e of G)le.push_back($e);const xe=t["_manifold"+D+"N"](le);return le.delete(),xe}}t.Manifold.union=st("Union"),t.Manifold.compose=t.Manifold.union,t.Manifold.difference=st("Difference"),t.Manifold.intersection=st("Intersection"),t.Manifold.levelSet=function(D,G,le,xe=0,$e=-1){const ht={min:{x:G.min[0],y:G.min[1],z:G.min[2]},max:{x:G.max[0],y:G.max[1],z:G.max[2]}},Et=Pr(function(It){const gi=K(It,"double"),ar=K(It+8,"double"),Yt=K(It+16,"double");return D([gi,ar,Yt])},"di"),Xt=t._LevelSet(Et,ht,le,xe,$e);return Lr(Et),Xt},t.ExecutionContext.prototype.fromMesh=function(D){return this._FromMesh(D)},t.ExecutionContext.prototype.smooth=function(D,G=[]){const le=new t.Vector_smoothness;m(le,G);const xe=this._Smooth(D,le);return le.delete(),xe},t.ExecutionContext.prototype.levelSet=function(D,G,le,xe=0,$e=-1){const ht={min:{x:G.min[0],y:G.min[1],z:G.min[2]},max:{x:G.max[0],y:G.max[1],z:G.max[2]}},Et=Pr(function(It){const gi=K(It,"double"),ar=K(It+8,"double"),Yt=K(It+16,"double");return D([gi,ar,Yt])},"di"),Xt=this._LevelSet(Et,ht,le,xe,$e);return Lr(Et),Xt};function dt(D,G){m(D,G,le=>le instanceof Array?{x:le[0],y:le[1],z:le[2]}:le)}t.Manifold.hull=function(...D){D.length==1&&(D=D[0]);let G=new t.Vector_vec3;for(const xe of D)xe instanceof Je?t._manifoldCollectVertices(G,xe):xe instanceof Array&&xe.length==3&&typeof xe[0]=="number"?G.push_back({x:xe[0],y:xe[1],z:xe[2]}):xe.x?G.push_back(xe):dt(G,xe);const le=t._manifoldHullPoints(G);return G.delete(),le},t.Manifold.prototype=Object.create(Je.prototype),Object.defineProperty(t.Manifold,Symbol.hasInstance,{get:()=>D=>D instanceof Je}),t.triangulate=function(D,G=-1,le=!0){const xe=P(D),$e=g(t._Triangulate(xe,G,le),ht=>[ht[0],ht[1],ht[2]]);return O(xe),$e}};var l=import.meta.url,c="";function u(m){return t.locateFile?t.locateFile(m,c):c+m}var h,f;if(s){var d=o("node:fs");l.startsWith("file:")&&(c=o("node:path").dirname(o("node:url").fileURLToPath(l))+"/"),f=m=>{m=p(m)?new URL(m):m;var g=d.readFileSync(m);return g},h=async(m,g=!0)=>{m=p(m)?new URL(m):m;var b=d.readFileSync(m,g?void 0:"utf8");return b},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2)}else if(i||r){try{c=new URL(".",l).href}catch{}r&&(f=m=>{var g=new XMLHttpRequest;return g.open("GET",m,!1),g.responseType="arraybuffer",g.send(null),new Uint8Array(g.response)}),h=async m=>{if(p(m))return new Promise((b,P)=>{var O=new XMLHttpRequest;O.open("GET",m,!0),O.responseType="arraybuffer",O.onload=()=>{if(O.status==200||O.status==0&&O.response){b(O.response);return}P(O.status)},O.onerror=P,O.send(null)});var g=await fetch(m,{credentials:"same-origin"});if(g.ok)return g.arrayBuffer();throw new Error(g.status+" : "+g.url)}}console.log.bind(console);var v=console.error.bind(console),x,_=!1,p=m=>m.startsWith("file://"),A,R,M,F,I,U,W,w,E,B,ue,ne,de=!1;function be(){var m=ra.buffer;M=new Int8Array(m),I=new Int16Array(m),F=new Uint8Array(m),U=new Uint16Array(m),W=new Int32Array(m),w=new Uint32Array(m),E=new Float32Array(m),B=new Float64Array(m),ue=new BigInt64Array(m),ne=new BigUint64Array(m)}function H(){if(t.preRun)for(typeof t.preRun=="function"&&(t.preRun=[t.preRun]);t.preRun.length;)N(t.preRun.shift());nt(L)}function Q(){de=!0,Ir.J()}function z(){if(t.postRun)for(typeof t.postRun=="function"&&(t.postRun=[t.postRun]);t.postRun.length;)_t(t.postRun.shift());nt(it)}function ge(m){var b;(b=t.onAbort)==null||b.call(t,m),m="Aborted("+m+")",v(m),_=!0,m+=". Build with -sASSERTIONS for more info.";var g=new WebAssembly.RuntimeError(m);throw R==null||R(g),g}var Ae;function ke(){return t.locateFile?u("manifold.wasm"):new URL("/assets/manifold-B_yLhOkb.wasm",import.meta.url).href}function Ze(m){if(m==Ae&&x)return new Uint8Array(x);if(f)return f(m);throw"both async and sync fetching of the wasm failed"}async function Mt(m){if(!x)try{var g=await h(m);return new Uint8Array(g)}catch{}return Ze(m)}async function _e(m,g){try{var b=await Mt(m),P=await WebAssembly.instantiate(b,g);return P}catch(O){v(`failed to asynchronously prepare wasm: ${O}`),ge(O)}}async function Le(m,g,b){if(!m&&!p(g)&&!s)try{var P=fetch(g,{credentials:"same-origin"}),O=await WebAssembly.instantiateStreaming(P,b);return O}catch(q){v(`wasm streaming compile failed: ${q}`),v("falling back to ArrayBuffer instantiation")}return _e(g,b)}function je(){var m={a:jg};return m}async function De(){function m(q,Y){return Ir=q.exports,Ir=$g(Ir),Xg(Ir),be(),Ir}function g(q){return m(q.instance)}var b=je();if(t.instantiateWasm)return new Promise((q,Y)=>{t.instantiateWasm(b,(ee,me)=>{q(m(ee))})});Ae??(Ae=ke());var P=await Le(x,Ae,b),O=g(P);return O}var nt=m=>{for(;m.length>0;)m.shift()(t)},it=[],_t=m=>it.push(m),L=[],N=m=>L.push(m);function K(m,g="i8"){switch(g.endsWith("*")&&(g="*"),g){case"i1":return M[m>>>0];case"i8":return M[m>>>0];case"i16":return I[m>>>1>>>0];case"i32":return W[m>>>2>>>0];case"i64":return ue[m>>>3>>>0];case"float":return E[m>>>2>>>0];case"double":return B[m>>>3>>>0];case"*":return w[m>>>2>>>0];default:ge(`invalid type for getValue: ${g}`)}}function C(m,g,b="i8"){switch(b.endsWith("*")&&(b="*"),b){case"i1":M[m>>>0]=g;break;case"i8":M[m>>>0]=g;break;case"i16":I[m>>>1>>>0]=g;break;case"i32":W[m>>>2>>>0]=g;break;case"i64":ue[m>>>3>>>0]=BigInt(g);break;case"float":E[m>>>2>>>0]=g;break;case"double":B[m>>>3>>>0]=g;break;case"*":w[m>>>2>>>0]=g;break;default:ge(`invalid type for setValue: ${b}`)}}class pe{constructor(g){this.excPtr=g,this.ptr=g-24}set_type(g){w[this.ptr+4>>>2>>>0]=g}get_type(){return w[this.ptr+4>>>2>>>0]}set_destructor(g){w[this.ptr+8>>>2>>>0]=g}get_destructor(){return w[this.ptr+8>>>2>>>0]}set_caught(g){g=g?1:0,M[this.ptr+12>>>0]=g}get_caught(){return M[this.ptr+12>>>0]!=0}set_rethrown(g){g=g?1:0,M[this.ptr+13>>>0]=g}get_rethrown(){return M[this.ptr+13>>>0]!=0}init(g,b){this.set_adjusted_ptr(0),this.set_type(g),this.set_destructor(b)}set_adjusted_ptr(g){w[this.ptr+16>>>2>>>0]=g}get_adjusted_ptr(){return w[this.ptr+16>>>2>>>0]}}var se=0;function ve(m,g,b){m>>>=0,g>>>=0,b>>>=0;var P=new pe(m);throw P.init(g,b),se=m,se}var oe=()=>ge(""),ye={},Z=m=>{for(;m.length;){var g=m.pop(),b=m.pop();b(g)}};function T(m){return this.fromWireType(w[m>>>2>>>0])}var y={},V={},J={},ae=class extends Error{constructor(g){super(g),this.name="InternalError"}},te=m=>{throw new ae(m)},we=(m,g,b)=>{m.forEach(ee=>J[ee]=g);function P(ee){var me=b(ee);me.length!==m.length&&te("Mismatched type converter count");for(var Ee=0;Ee<m.length;++Ee)We(m[Ee],me[Ee])}var O=new Array(g.length),q=[],Y=0;for(let[ee,me]of g.entries())V.hasOwnProperty(me)?O[ee]=V[me]:(q.push(me),y.hasOwnProperty(me)||(y[me]=[]),y[me].push(()=>{O[ee]=V[me],++Y,Y===q.length&&P(O)}));q.length===0&&P(O)},Re=function(m){m>>>=0;var g=ye[m];delete ye[m];var b=g.rawConstructor,P=g.rawDestructor,O=g.fields,q=O.map(Y=>Y.getterReturnType).concat(O.map(Y=>Y.setterArgumentType));we([m],q,Y=>{var ee={};for(var[me,Ee]of O.entries()){const Pe=Y[me],Ie=Ee.getter,ze=Ee.getterContext,Ye=Y[me+O.length],Je=Ee.setter,st=Ee.setterContext;ee[Ee.fieldName]={read:dt=>Pe.fromWireType(Ie(ze,dt)),write:(dt,D)=>{var G=[];Je(st,dt,Ye.toWireType(G,D)),Z(G)},optional:Pe.optional}}return[{name:g.name,fromWireType:Pe=>{var Ie={};for(var ze in ee)Ie[ze]=ee[ze].read(Pe);return P(Pe),Ie},toWireType:(Pe,Ie)=>{for(var ze in ee)if(!(ze in Ie)&&!ee[ze].optional)throw new TypeError(`Missing field: "${ze}"`);var Ye=b();for(ze in ee)ee[ze].write(Ye,Ie[ze]);return Pe!==null&&Pe.push(P,Ye),Ye},readValueFromPointer:T,destructorFunction:P}]})},Te=m=>{m>>>=0;for(var g="";;){var b=F[m++>>>0];if(!b)return g;g+=String.fromCharCode(b)}},rt=class extends Error{constructor(g){super(g),this.name="BindingError"}},he=m=>{throw new rt(m)};function Ne(m,g,b={}){var P=g.name;if(m||he(`type "${P}" must have a positive integer typeid pointer`),V.hasOwnProperty(m)){if(b.ignoreDuplicateRegistrations)return;he(`Cannot register type '${P}' twice`)}if(V[m]=g,delete J[m],y.hasOwnProperty(m)){var O=y[m];delete y[m],O.forEach(q=>q())}}function We(m,g,b={}){return Ne(m,g,b)}var Ke=(m,g,b)=>{switch(g){case 1:return b?P=>M[P>>>0]:P=>F[P>>>0];case 2:return b?P=>I[P>>>1>>>0]:P=>U[P>>>1>>>0];case 4:return b?P=>W[P>>>2>>>0]:P=>w[P>>>2>>>0];case 8:return b?P=>ue[P>>>3>>>0]:P=>ne[P>>>3>>>0];default:throw new TypeError(`invalid integer width (${g}): ${m}`)}},Ue=function(m,g,b,P,O){m>>>=0,g>>>=0,b>>>=0,g=Te(g);const q=P===0n;let Y=ee=>ee;if(q){const ee=b*8;Y=me=>BigInt.asUintN(ee,me),O=Y(O)}We(m,{name:g,fromWireType:Y,toWireType:(ee,me)=>(typeof me=="number"&&(me=BigInt(me)),me),readValueFromPointer:Ke(g,b,!q),destructorFunction:null})};function xt(m,g,b,P){m>>>=0,g>>>=0,g=Te(g),We(m,{name:g,fromWireType:function(O){return!!O},toWireType:function(O,q){return q?b:P},readValueFromPointer:function(O){return this.fromWireType(F[O>>>0])},destructorFunction:null})}var ft=m=>({count:m.count,deleteScheduled:m.deleteScheduled,preservePointerOnDelete:m.preservePointerOnDelete,ptr:m.ptr,ptrType:m.ptrType,smartPtr:m.smartPtr,smartPtrType:m.smartPtrType}),Nt=m=>{function g(b){return b.$$.ptrType.registeredClass.name}he(g(m)+" instance already deleted")},X=!1,Fe=m=>{},fe=m=>{m.smartPtr?m.smartPtrType.rawDestructor(m.smartPtr):m.ptrType.registeredClass.rawDestructor(m.ptr)},Me=m=>{m.count.value-=1;var g=m.count.value===0;g&&fe(m)},Oe=m=>globalThis.FinalizationRegistry?(X=new FinalizationRegistry(g=>{Me(g.$$)}),Oe=g=>{var b=g.$$,P=!!b.smartPtr;if(P){var O={$$:b};X.register(g,O,g)}return g},Fe=g=>X.unregister(g),Oe(m)):(Oe=g=>g,m),He=()=>{let m=ct.prototype;Object.assign(m,{isAliasOf(b){if(!(this instanceof ct)||!(b instanceof ct))return!1;var P=this.$$.ptrType.registeredClass,O=this.$$.ptr;b.$$=b.$$;for(var q=b.$$.ptrType.registeredClass,Y=b.$$.ptr;P.baseClass;)O=P.upcast(O),P=P.baseClass;for(;q.baseClass;)Y=q.upcast(Y),q=q.baseClass;return P===q&&O===Y},clone(){if(this.$$.ptr||Nt(this),this.$$.preservePointerOnDelete)return this.$$.count.value+=1,this;var b=Oe(Object.create(Object.getPrototypeOf(this),{$$:{value:ft(this.$$)}}));return b.$$.count.value+=1,b.$$.deleteScheduled=!1,b},delete(){this.$$.ptr||Nt(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&he("Object already scheduled for deletion"),Fe(this),Me(this.$$),this.$$.preservePointerOnDelete||(this.$$.smartPtr=void 0,this.$$.ptr=void 0)},isDeleted(){return!this.$$.ptr},deleteLater(){return this.$$.ptr||Nt(this),this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete&&he("Object already scheduled for deletion"),this.$$.deleteScheduled=!0,this}});const g=Symbol.dispose;g&&(m[g]=m.delete)};function ct(){}var Ht=(m,g)=>Object.defineProperty(g,"name",{value:m}),on={},Pt=(m,g,b)=>{if(m[g].overloadTable===void 0){var P=m[g];m[g]=function(...O){return m[g].overloadTable.hasOwnProperty(O.length)||he(`Function '${b}' called with an invalid number of arguments (${O.length}) - expects one of (${m[g].overloadTable})!`),m[g].overloadTable[O.length].apply(this,O)},m[g].overloadTable=[],m[g].overloadTable[P.argCount]=P}},gn=(m,g,b)=>{t.hasOwnProperty(m)?((b===void 0||t[m].overloadTable!==void 0&&t[m].overloadTable[b]!==void 0)&&he(`Cannot register public name '${m}' twice`),Pt(t,m,m),t[m].overloadTable.hasOwnProperty(b)&&he(`Cannot register multiple overloads of a function with the same number of arguments (${b})!`),t[m].overloadTable[b]=g):(t[m]=g,t[m].argCount=b)},ei=48,Jo=57,Qo=m=>{m=m.replace(/[^a-zA-Z0-9_]/g,"$");var g=m.charCodeAt(0);return g>=ei&&g<=Jo?`_${m}`:m};function Bi(m,g,b,P,O,q,Y,ee){this.name=m,this.constructor=g,this.instancePrototype=b,this.rawDestructor=P,this.baseClass=O,this.getActualType=q,this.upcast=Y,this.downcast=ee,this.pureVirtualFunctions=[]}var wr=(m,g,b)=>{for(;g!==b;)g.upcast||he(`Expected null or instance of ${b.name}, got an instance of ${g.name}`),m=g.upcast(m),g=g.baseClass;return m},ss=m=>{if(m===null)return"null";var g=typeof m;return g==="object"||g==="array"||g==="function"?m.toString():""+m};function ea(m,g){if(g===null)return this.isReference&&he(`null is not a valid ${this.name}`),0;g.$$||he(`Cannot pass "${ss(g)}" as a ${this.name}`),g.$$.ptr||he(`Cannot pass deleted object as a pointer of type ${this.name}`);var b=g.$$.ptrType.registeredClass,P=wr(g.$$.ptr,b,this.registeredClass);return P}function os(m,g){var b;if(g===null)return this.isReference&&he(`null is not a valid ${this.name}`),this.isSmartPointer?(b=this.rawConstructor(),m!==null&&m.push(this.rawDestructor,b),b):0;(!g||!g.$$)&&he(`Cannot pass "${ss(g)}" as a ${this.name}`),g.$$.ptr||he(`Cannot pass deleted object as a pointer of type ${this.name}`),!this.isConst&&g.$$.ptrType.isConst&&he(`Cannot convert argument of type ${g.$$.smartPtrType?g.$$.smartPtrType.name:g.$$.ptrType.name} to parameter type ${this.name}`);var P=g.$$.ptrType.registeredClass;if(b=wr(g.$$.ptr,P,this.registeredClass),this.isSmartPointer)switch(g.$$.smartPtr===void 0&&he("Passing raw pointer to smart pointer is illegal"),this.sharingPolicy){case 0:g.$$.smartPtrType===this?b=g.$$.smartPtr:he(`Cannot convert argument of type ${g.$$.smartPtrType?g.$$.smartPtrType.name:g.$$.ptrType.name} to parameter type ${this.name}`);break;case 1:b=g.$$.smartPtr;break;case 2:if(g.$$.smartPtrType===this)b=g.$$.smartPtr;else{var O=g.clone();b=this.rawShare(b,Lt.toHandle(()=>O.delete())),m!==null&&m.push(this.rawDestructor,b)}break;default:he("Unsupported sharing policy")}return b}function ta(m,g){if(g===null)return this.isReference&&he(`null is not a valid ${this.name}`),0;g.$$||he(`Cannot pass "${ss(g)}" as a ${this.name}`),g.$$.ptr||he(`Cannot pass deleted object as a pointer of type ${this.name}`),g.$$.ptrType.isConst&&he(`Cannot convert argument of type ${g.$$.ptrType.name} to parameter type ${this.name}`);var b=g.$$.ptrType.registeredClass,P=wr(g.$$.ptr,b,this.registeredClass);return P}var Rr=(m,g,b)=>{if(g===b)return m;if(b.baseClass===void 0)return null;var P=Rr(m,g,b.baseClass);return P===null?null:b.downcast(P)},na={},ia=(m,g)=>{for(g===void 0&&he("ptr should not be undefined");m.baseClass;)g=m.upcast(g),m=m.baseClass;return g},Ll=(m,g)=>(g=ia(m,g),na[g]),as=(m,g)=>{(!g.ptrType||!g.ptr)&&te("makeClassHandle requires ptr and ptrType");var b=!!g.smartPtrType,P=!!g.smartPtr;return b!==P&&te("Both smartPtrType and smartPtr must be specified"),g.count={value:1},Oe(Object.create(m,{$$:{value:g,writable:!0}}))};function Il(m){var g=this.getPointee(m);if(!g)return this.destructor(m),null;var b=Ll(this.registeredClass,g);if(b!==void 0){if(b.$$.count.value===0)return b.$$.ptr=g,b.$$.smartPtr=m,b.clone();var P=b.clone();return this.destructor(m),P}function O(){return this.isSmartPointer?as(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:g,smartPtrType:this,smartPtr:m}):as(this.registeredClass.instancePrototype,{ptrType:this,ptr:m})}var q=this.registeredClass.getActualType(g),Y=on[q];if(!Y)return O.call(this);var ee;this.isConst?ee=Y.constPointerType:ee=Y.pointerType;var me=Rr(g,this.registeredClass,ee.registeredClass);return me===null?O.call(this):this.isSmartPointer?as(ee.registeredClass.instancePrototype,{ptrType:ee,ptr:me,smartPtrType:this,smartPtr:m}):as(ee.registeredClass.instancePrototype,{ptrType:ee,ptr:me})}var Dl=()=>{Object.assign(ls.prototype,{getPointee(m){return this.rawGetPointee&&(m=this.rawGetPointee(m)),m},destructor(m){var g;(g=this.rawDestructor)==null||g.call(this,m)},readValueFromPointer:T,fromWireType:Il})};function ls(m,g,b,P,O,q,Y,ee,me,Ee,Pe){this.name=m,this.registeredClass=g,this.isReference=b,this.isConst=P,this.isSmartPointer=O,this.pointeeType=q,this.sharingPolicy=Y,this.rawGetPointee=ee,this.rawConstructor=me,this.rawShare=Ee,this.rawDestructor=Pe,!O&&g.baseClass===void 0?P?(this.toWireType=ea,this.destructorFunction=null):(this.toWireType=ta,this.destructorFunction=null):this.toWireType=os}var S=(m,g,b)=>{t.hasOwnProperty(m)||te("Replacing nonexistent public symbol"),t[m].overloadTable!==void 0&&b!==void 0?t[m].overloadTable[b]=g:(t[m]=g,t[m].argCount=b)},$=m=>io.get(m),ie=(m,g,b=[],P=!1)=>{var O=$(g),q=O(...b);function Y(ee){return m[0]=="p"?ee>>>0:ee}return Y(q)},re=(m,g,b=!1)=>(...P)=>ie(m,g,P,b),j=(m,g,b=!1)=>{m=Te(m);function P(){if(m.includes("p"))return re(m,g,b);var q=$(g);return q}var O=P();return typeof O!="function"&&he(`unknown function pointer with signature ${m}: ${g}`),O};class Ce extends Error{}var Be=m=>{var g=Dh(m),b=Te(g);return or(g),b},Ge=(m,g)=>{var b=[],P={};function O(q){if(!P[q]&&!V[q]){if(J[q]){J[q].forEach(O);return}b.push(q),P[q]=!0}}throw g.forEach(O),new Ce(`${m}: `+b.map(Be).join([", "]))};function qe(m,g,b,P,O,q,Y,ee,me,Ee,Pe,Ie,ze){m>>>=0,g>>>=0,b>>>=0,P>>>=0,O>>>=0,q>>>=0,Y>>>=0,ee>>>=0,me>>>=0,Ee>>>=0,Pe>>>=0,Ie>>>=0,ze>>>=0,Pe=Te(Pe),q=j(O,q),ee&&(ee=j(Y,ee)),Ee&&(Ee=j(me,Ee)),ze=j(Ie,ze);var Ye=Qo(Pe);gn(Ye,function(){Ge(`Cannot construct ${Pe} due to unbound types`,[P])}),we([m,g,b],P?[P]:[],Je=>{var Et;Je=Je[0];var st,dt;P?(st=Je.registeredClass,dt=st.instancePrototype):dt=ct.prototype;var D=Ht(Pe,function(...Xt){if(Object.getPrototypeOf(this)!==G)throw new rt(`Use 'new' to construct ${Pe}`);if(le.constructor_body===void 0)throw new rt(`${Pe} has no accessible constructor`);var It=le.constructor_body[Xt.length];if(It===void 0)throw new rt(`Tried to invoke ctor of ${Pe} with invalid number of parameters (${Xt.length}) - expected (${Object.keys(le.constructor_body).toString()}) parameters instead!`);return It.apply(this,Xt)}),G=Object.create(dt,{constructor:{value:D}});D.prototype=G;var le=new Bi(Pe,D,G,ze,st,q,ee,Ee);le.baseClass&&((Et=le.baseClass).__derivedClasses??(Et.__derivedClasses=[]),le.baseClass.__derivedClasses.push(le));var xe=new ls(Pe,le,!0,!1,!1),$e=new ls(Pe+"*",le,!1,!1,!1),ht=new ls(Pe+" const*",le,!1,!0,!1);return on[m]={pointerType:$e,constPointerType:ht},S(Ye,D),[xe,$e,ht]})}var ot=(m,g)=>{for(var b=[],P=0;P<m;P++)b.push(w[g+P*4>>>2>>>0]);return b};function ut(m){for(var g=1;g<m.length;++g)if(m[g]!==null&&m[g].destructorFunction===void 0)return!0;return!1}var Qe={ftf:function(g,b,P,O,q,Y,ee){return function(){var me=P(O),Ee=Y(me);return Ee}},tffn:function(g,b,P,O,q,Y,ee){return function(){var me=ee(null,this);P(O,me)}},ttfn:function(g,b,P,O,q,Y,ee){return function(){var me=ee(null,this),Ee=P(O,me),Pe=Y(Ee);return Pe}},ttfnn:function(g,b,P,O,q,Y,ee,me){return function(Ee){var Pe=ee(null,this),Ie=me(null,Ee),ze=P(O,Pe,Ie),Ye=Y(ze);return Ye}},ttfnnn:function(g,b,P,O,q,Y,ee,me,Ee){return function(Pe,Ie){var ze=ee(null,this),Ye=me(null,Pe),Je=Ee(null,Ie),st=P(O,ze,Ye,Je),dt=Y(st);return dt}},ttfnntnnn:function(g,b,P,O,q,Y,ee,me,Ee,Pe,Ie,ze,Ye){return function(Je,st,dt,D,G){var le=ee(null,this),xe=me(null,Je),$e=Ee(null,st),ht=Pe(null,dt),Et=Ie(null,D),Xt=ze(null,G),It=P(O,le,xe,$e,ht,Et,Xt);Ye($e);var gi=Y(It);return gi}},tffnt:function(g,b,P,O,q,Y,ee,me,Ee){return function(Pe){var Ie=ee(null,this),ze=me(null,Pe);P(O,Ie,ze),Ee(ze)}},tffnnt:function(g,b,P,O,q,Y,ee,me,Ee,Pe){return function(Ie,ze){var Ye=ee(null,this),Je=me(null,Ie),st=Ee(null,ze);P(O,Ye,Je,st),Pe(st)}},ttfnnt:function(g,b,P,O,q,Y,ee,me,Ee,Pe){return function(Ie,ze){var Ye=ee(null,this),Je=me(null,Ie),st=Ee(null,ze),dt=P(O,Ye,Je,st);Pe(st);var D=Y(dt);return D}},tffnn:function(g,b,P,O,q,Y,ee,me){return function(Ee){var Pe=ee(null,this),Ie=me(null,Ee);P(O,Pe,Ie)}},tffnnn:function(g,b,P,O,q,Y,ee,me,Ee){return function(Pe,Ie){var ze=ee(null,this),Ye=me(null,Pe),Je=Ee(null,Ie);P(O,ze,Ye,Je)}},ftfnn:function(g,b,P,O,q,Y,ee,me,Ee){return function(Pe,Ie){var ze=me(null,Pe),Ye=Ee(null,Ie),Je=P(O,ze,Ye),st=Y(Je);return st}},ttfnt:function(g,b,P,O,q,Y,ee,me,Ee){return function(Pe){var Ie=ee(null,this),ze=me(null,Pe),Ye=P(O,Ie,ze);Ee(ze);var Je=Y(Ye);return Je}},ttfnnnnn:function(g,b,P,O,q,Y,ee,me,Ee,Pe,Ie){return function(ze,Ye,Je,st){var dt=ee(null,this),D=me(null,ze),G=Ee(null,Ye),le=Pe(null,Je),xe=Ie(null,st),$e=P(O,dt,D,G,le,xe),ht=Y($e);return ht}},ftftn:function(g,b,P,O,q,Y,ee,me,Ee,Pe){return function(Ie,ze){var Ye=me(null,Ie),Je=Ee(null,ze),st=P(O,Ye,Je);Pe(Ye);var dt=Y(st);return dt}},ftfn:function(g,b,P,O,q,Y,ee,me){return function(Ee){var Pe=me(null,Ee),Ie=P(O,Pe),ze=Y(Ie);return ze}},fffnn:function(g,b,P,O,q,Y,ee,me,Ee){return function(Pe,Ie){var ze=me(null,Pe),Ye=Ee(null,Ie);P(O,ze,Ye)}},ttfntn:function(g,b,P,O,q,Y,ee,me,Ee,Pe){return function(Ie,ze){var Ye=ee(null,this),Je=me(null,Ie),st=Ee(null,ze),dt=P(O,Ye,Je,st);Pe(Je);var D=Y(dt);return D}},ttfnnnn:function(g,b,P,O,q,Y,ee,me,Ee,Pe){return function(Ie,ze,Ye){var Je=ee(null,this),st=me(null,Ie),dt=Ee(null,ze),D=Pe(null,Ye),G=P(O,Je,st,dt,D),le=Y(G);return le}},ttfntt:function(g,b,P,O,q,Y,ee,me,Ee,Pe,Ie){return function(ze,Ye){var Je=ee(null,this),st=me(null,ze),dt=Ee(null,Ye),D=P(O,Je,st,dt);Pe(st),Ie(dt);var G=Y(D);return G}},ftfnnnnn:function(g,b,P,O,q,Y,ee,me,Ee,Pe,Ie,ze){return function(Ye,Je,st,dt,D){var G=me(null,Ye),le=Ee(null,Je),xe=Pe(null,st),$e=Ie(null,dt),ht=ze(null,D),Et=P(O,G,le,xe,$e,ht),Xt=Y(Et);return Xt}},ftfnnnnt:function(g,b,P,O,q,Y,ee,me,Ee,Pe,Ie,ze,Ye){return function(Je,st,dt,D,G){var le=me(null,Je),xe=Ee(null,st),$e=Pe(null,dt),ht=Ie(null,D),Et=ze(null,G),Xt=P(O,le,xe,$e,ht,Et);Ye(Et);var It=Y(Xt);return It}},ftfnnn:function(g,b,P,O,q,Y,ee,me,Ee,Pe){return function(Ie,ze,Ye){var Je=me(null,Ie),st=Ee(null,ze),dt=Pe(null,Ye),D=P(O,Je,st,dt),G=Y(D);return G}},ftfntnnn:function(g,b,P,O,q,Y,ee,me,Ee,Pe,Ie,ze,Ye){return function(Je,st,dt,D,G){var le=me(null,Je),xe=Ee(null,st),$e=Pe(null,dt),ht=Ie(null,D),Et=ze(null,G),Xt=P(O,le,xe,$e,ht,Et);Ye(xe);var It=Y(Xt);return It}},fffn:function(g,b,P,O,q,Y,ee,me){return function(Ee){var Pe=me(null,Ee);P(O,Pe)}},fff:function(g,b,P,O,q,Y,ee){return function(){P(O)}}};function bt(m,g,b,P){const O=[g?"t":"f",b?"t":"f",P?"t":"f"];for(let q=g?1:2;q<m.length;++q){const Y=m[q];let ee="";Y.destructorFunction===void 0?ee="u":Y.destructorFunction===null?ee="n":ee="t",O.push(ee)}return O.join("")}function Tt(m,g,b,P,O,q){var Y=g.length;Y<2&&he("argTypes array size mismatch! Must at least get return value and 'this' types!");for(var ee=g[1]!==null&&b!==null,me=ut(g),Ee=!g[0].isVoid,Pe=g[0],Ie=g[1],ze=[m,he,P,O,Z,Pe.fromWireType.bind(Pe),Ie==null?void 0:Ie.toWireType.bind(Ie)],Ye=2;Ye<Y;++Ye){var Je=g[Ye];ze.push(Je.toWireType.bind(Je))}if(!me)for(var Ye=ee?1:2;Ye<g.length;++Ye)g[Ye].destructorFunction!==null&&ze.push(g[Ye].destructorFunction);var st=bt(g,ee,Ee,q),dt=Qe[st](...ze);return Ht(m,dt)}var tn=function(m,g,b,P,O,q){m>>>=0,b>>>=0,P>>>=0,O>>>=0,q>>>=0;var Y=ot(g,b);O=j(P,O),we([],[m],ee=>{ee=ee[0];var me=`constructor ${ee.name}`;if(ee.registeredClass.constructor_body===void 0&&(ee.registeredClass.constructor_body=[]),ee.registeredClass.constructor_body[g-1]!==void 0)throw new rt(`Cannot register multiple constructors with identical number of parameters (${g-1}) for class '${ee.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);return ee.registeredClass.constructor_body[g-1]=()=>{Ge(`Cannot construct ${ee.name} due to unbound types`,Y)},we([],Y,Ee=>(Ee.splice(1,0,null),ee.registeredClass.constructor_body[g-1]=Tt(me,Ee,null,O,q),[])),[]})},$t=m=>{m=m.trim();const g=m.indexOf("(");return g===-1?m:m.slice(0,g)},At=function(m,g,b,P,O,q,Y,ee,me,Ee){m>>>=0,g>>>=0,P>>>=0,O>>>=0,q>>>=0,Y>>>=0;var Pe=ot(b,P);g=Te(g),g=$t(g),q=j(O,q,me),we([],[m],Ie=>{Ie=Ie[0];var ze=`${Ie.name}.${g}`;g.startsWith("@@")&&(g=Symbol[g.substring(2)]),ee&&Ie.registeredClass.pureVirtualFunctions.push(g);function Ye(){Ge(`Cannot call ${ze} due to unbound types`,Pe)}var Je=Ie.registeredClass.instancePrototype,st=Je[g];return st===void 0||st.overloadTable===void 0&&st.className!==Ie.name&&st.argCount===b-2?(Ye.argCount=b-2,Ye.className=Ie.name,Je[g]=Ye):(Pt(Je,g,ze),Je[g].overloadTable[b-2]=Ye),we([],Pe,dt=>{var D=Tt(ze,dt,Ie,q,Y,me);return Je[g].overloadTable===void 0?(D.argCount=b-2,Je[g]=D):Je[g].overloadTable[b-2]=D,[]}),[]})},et=[],qt=[0,1,,1,null,1,!0,1,!1,1];function wt(m){m>>>=0,m>9&&--qt[m+1]===0&&(qt[m]=void 0,et.push(m))}var Lt={toValue:m=>(m||he(`Cannot use deleted val. handle = ${m}`),qt[m]),toHandle:m=>{switch(m){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:{const g=et.pop()||qt.length;return qt[g]=m,qt[g+1]=1,g}}}},Vi={name:"emscripten::val",fromWireType:m=>{var g=Lt.toValue(m);return wt(m),g},toWireType:(m,g)=>Lt.toHandle(g),readValueFromPointer:T,destructorFunction:null};function En(m){return m>>>=0,We(m,Vi)}var ki=(m,g,b)=>{switch(g){case 1:return b?function(P){return this.fromWireType(M[P>>>0])}:function(P){return this.fromWireType(F[P>>>0])};case 2:return b?function(P){return this.fromWireType(I[P>>>1>>>0])}:function(P){return this.fromWireType(U[P>>>1>>>0])};case 4:return b?function(P){return this.fromWireType(W[P>>>2>>>0])}:function(P){return this.fromWireType(w[P>>>2>>>0])};default:throw new TypeError(`invalid integer width (${g}): ${m}`)}};function Wt(m){return m===0?"object":m===1?"number":"string"}function Fn(m,g,b,P,O){m>>>=0,g>>>=0,b>>>=0,g=Te(g);const q=Wt(O);switch(q){case"object":{let Ee=function(){};Ee.values={},We(m,{name:g,constructor:Ee,valueType:q,fromWireType:function(Pe){return this.constructor.values[Pe]},toWireType:(Pe,Ie)=>Ie.value,readValueFromPointer:ki(g,b,P),destructorFunction:null}),gn(g,Ee);break}case"number":{var Y={};We(m,{name:g,keysMap:Y,valueType:q,fromWireType:Ee=>Ee,toWireType:(Ee,Pe)=>Pe,readValueFromPointer:ki(g,b,P),destructorFunction:null}),gn(g,Y),delete t[g].argCount;break}case"string":{var ee={},me={},Y={};We(m,{name:g,valuesMap:ee,reverseMap:me,keysMap:Y,valueType:q,fromWireType:function(Pe){return this.reverseMap[Pe]},toWireType:function(Pe,Ie){return this.valuesMap[Ie]},readValueFromPointer:ki(g,b,P),destructorFunction:null}),gn(g,Y),delete t[g].argCount;break}}}var Tn=(m,g)=>{var b=V[m];return b===void 0&&he(`${g} has unknown type ${Be(m)}`),b};function _n(m,g,b){m>>>=0,g>>>=0;var P=Tn(m,"enum");switch(g=Te(g),P.valueType){case"object":{var O=P.constructor,q=Object.create(P.constructor.prototype,{value:{value:b},constructor:{value:Ht(`${P.name}_${g}`,function(){})}});O.values[b]=q,O[g]=q;break}case"number":{P.keysMap[g]=b;break}case"string":{P.valuesMap[g]=b,P.reverseMap[b]=g,P.keysMap[g]=g;break}}}var xn=(m,g)=>{switch(g){case 4:return function(b){return this.fromWireType(E[b>>>2>>>0])};case 8:return function(b){return this.fromWireType(B[b>>>3>>>0])};default:throw new TypeError(`invalid float width (${g}): ${m}`)}},no=function(m,g,b){m>>>=0,g>>>=0,b>>>=0,g=Te(g),We(m,{name:g,fromWireType:P=>P,toWireType:(P,O)=>O,readValueFromPointer:xn(g,b),destructorFunction:null})};function zi(m,g,b,P,O,q,Y,ee){m>>>=0,b>>>=0,P>>>=0,O>>>=0,q>>>=0;var me=ot(g,b);m=Te(m),m=$t(m),O=j(P,O,Y),gn(m,function(){Ge(`Cannot call ${m} due to unbound types`,me)},g-1),we([],me,Ee=>{var Pe=[Ee[0],null].concat(Ee.slice(1));return S(m,Tt(m,Pe,null,O,q,Y),g-1),[]})}var eg=function(m,g,b,P,O){m>>>=0,g>>>=0,b>>>=0,g=Te(g);const q=P===0;let Y=me=>me;if(q){var ee=32-8*b;Y=me=>me<<ee>>>ee,O=Y(O)}We(m,{name:g,fromWireType:Y,toWireType:(me,Ee)=>Ee,readValueFromPointer:Ke(g,b,P!==0),destructorFunction:null})},tg=(m,g,b)=>{const P=(O,q)=>{let Y=0;return{next(){if(Y>=O)return{done:!0};const ee=Y;return Y++,{value:q(ee),done:!1}},[Symbol.iterator](){return this}}};m[Symbol.iterator]||(m[Symbol.iterator]=function(){const O=this[g]();return P(O,q=>this[b](q))})},ng=function(m,g,b,P){m>>>=0,g>>>=0,b>>>=0,P>>>=0,b=Te(b),P=Te(P),we([],[m,g],O=>{const q=O[0];return tg(q.registeredClass.instancePrototype,b,P),[]})};function ig(m,g,b){m>>>=0,b>>>=0;var P=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array],O=P[g];function q(Y){var ee=w[Y>>>2>>>0],me=w[Y+4>>>2>>>0];return new O(M.buffer,me,ee)}b=Te(b),We(m,{name:b,fromWireType:q,readValueFromPointer:q},{ignoreDuplicateRegistrations:!0})}var rg=Object.assign({optional:!0},Vi);function sg(m,g){m>>>=0,We(m,rg)}var og=(m,g,b,P)=>{if(b>>>=0,!(P>0))return 0;for(var O=b,q=b+P-1,Y=0;Y<m.length;++Y){var ee=m.codePointAt(Y);if(ee<=127){if(b>=q)break;g[b++>>>0]=ee}else if(ee<=2047){if(b+1>=q)break;g[b++>>>0]=192|ee>>6,g[b++>>>0]=128|ee&63}else if(ee<=65535){if(b+2>=q)break;g[b++>>>0]=224|ee>>12,g[b++>>>0]=128|ee>>6&63,g[b++>>>0]=128|ee&63}else{if(b+3>=q)break;g[b++>>>0]=240|ee>>18,g[b++>>>0]=128|ee>>12&63,g[b++>>>0]=128|ee>>6&63,g[b++>>>0]=128|ee&63,Y++}}return g[b>>>0]=0,b-O},ag=(m,g,b)=>og(m,F,g,b),lg=m=>{for(var g=0,b=0;b<m.length;++b){var P=m.charCodeAt(b);P<=127?g++:P<=2047?g+=2:P>=55296&&P<=57343?(g+=4,++b):g+=3}return g},wh=globalThis.TextDecoder&&new TextDecoder,Rh=(m,g,b,P)=>{var O=g+b;if(P)return O;for(;m[g]&&!(g>=O);)++g;return g},cg=(m,g=0,b,P)=>{g>>>=0;var O=Rh(m,g,b,P);if(O-g>16&&m.buffer&&wh)return wh.decode(m.subarray(g,O));for(var q="";g<O;){var Y=m[g++];if(!(Y&128)){q+=String.fromCharCode(Y);continue}var ee=m[g++]&63;if((Y&224)==192){q+=String.fromCharCode((Y&31)<<6|ee);continue}var me=m[g++]&63;if((Y&240)==224?Y=(Y&15)<<12|ee<<6|me:Y=(Y&7)<<18|ee<<12|me<<6|m[g++]&63,Y<65536)q+=String.fromCharCode(Y);else{var Ee=Y-65536;q+=String.fromCharCode(55296|Ee>>10,56320|Ee&1023)}}return q},ug=(m,g,b)=>(m>>>=0,m?cg(F,m,g,b):"");function hg(m,g){m>>>=0,g>>>=0,g=Te(g),We(m,{name:g,fromWireType(b){var P=w[b>>>2>>>0],O=b+4,q;return q=ug(O,P,!0),or(b),q},toWireType(b,P){P instanceof ArrayBuffer&&(P=new Uint8Array(P));var O,q=typeof P=="string";q||ArrayBuffer.isView(P)&&P.BYTES_PER_ELEMENT==1||he("Cannot pass non-string to std::string"),q?O=lg(P):O=P.length;var Y=Ol(4+O+1),ee=Y+4;return w[Y>>>2>>>0]=O,q?ag(P,ee,O+1):F.set(P,ee>>>0),b!==null&&b.push(or,Y),Y},readValueFromPointer:T,destructorFunction(b){or(b)}})}var Ch=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,fg=(m,g,b)=>{var P=m>>>1,O=Rh(U,P,g/2,b);if(O-P>16&&Ch)return Ch.decode(U.subarray(P>>>0,O>>>0));for(var q="",Y=P;Y<O;++Y){var ee=U[Y>>>0];q+=String.fromCharCode(ee)}return q},dg=(m,g,b)=>{if(b??(b=2147483647),b<2)return 0;b-=2;for(var P=g,O=b<m.length*2?b/2:m.length,q=0;q<O;++q){var Y=m.charCodeAt(q);I[g>>>1>>>0]=Y,g+=2}return I[g>>>1>>>0]=0,g-P},pg=m=>m.length*2,mg=(m,g,b)=>{for(var P="",O=m>>>2,q=0;!(q>=g/4);q++){var Y=w[O+q>>>0];if(!Y&&!b)break;P+=String.fromCodePoint(Y)}return P},gg=(m,g,b)=>{if(g>>>=0,b??(b=2147483647),b<4)return 0;for(var P=g,O=P+b-4,q=0;q<m.length;++q){var Y=m.codePointAt(q);if(Y>65535&&q++,W[g>>>2>>>0]=Y,g+=4,g+4>O)break}return W[g>>>2>>>0]=0,g-P},_g=m=>{for(var g=0,b=0;b<m.length;++b){var P=m.codePointAt(b);P>65535&&b++,g+=4}return g};function vg(m,g,b){m>>>=0,g>>>=0,b>>>=0,b=Te(b);var P,O,q;g===2?(P=fg,O=dg,q=pg):(P=mg,O=gg,q=_g),We(m,{name:b,fromWireType:Y=>{var ee=w[Y>>>2>>>0],me=P(Y+4,ee*g,!0);return or(Y),me},toWireType:(Y,ee)=>{typeof ee!="string"&&he(`Cannot pass non-string to C++ string type ${b}`);var me=q(ee),Ee=Ol(4+me+g);return w[Ee>>>2>>>0]=me/g,O(ee,Ee+4,me+g),Y!==null&&Y.push(or,Ee),Ee},readValueFromPointer:T,destructorFunction(Y){or(Y)}})}function xg(m,g,b,P,O,q){m>>>=0,g>>>=0,b>>>=0,P>>>=0,O>>>=0,q>>>=0,ye[m]={name:Te(g),rawConstructor:j(b,P),rawDestructor:j(O,q),fields:[]}}function yg(m,g,b,P,O,q,Y,ee,me,Ee){m>>>=0,g>>>=0,b>>>=0,P>>>=0,O>>>=0,q>>>=0,Y>>>=0,ee>>>=0,me>>>=0,Ee>>>=0,ye[m].fields.push({fieldName:Te(g),getterReturnType:b,getter:j(P,O),getterContext:q,setterArgumentType:Y,setter:j(ee,me),setterContext:Ee})}var Mg=function(m,g){m>>>=0,g>>>=0,g=Te(g),We(m,{isVoid:!0,name:g,fromWireType:()=>{},toWireType:(b,P)=>{}})};function Sg(m,g){m>>>=0,g>>>=0,m=Lt.toValue(m),g=Lt.toValue(g),m.set(g)}var Ul=[],bg=m=>{var g=Ul.length;return Ul.push(m),g},Eg=(m,g)=>{for(var b=new Array(m),P=0;P<m;++P)b[P]=Tn(w[g+P*4>>>2>>>0],`parameter ${P}`);return b},Tg=(m,g,b)=>{var P=[],O=m(P,b);return P.length&&(w[g>>>2>>>0]=Lt.toHandle(P)),O},Ag={},Ph=m=>{var g=Ag[m];return g===void 0?Te(m):g},wg=function(m,g,b){g>>>=0;var P=8,[O,...q]=Eg(m,g),Y=O.toWireType.bind(O),ee=q.map(Ie=>Ie.readValueFromPointer.bind(Ie));m--;var me=new Array(m),Ee=(Ie,ze,Ye,Je)=>{for(var st=0,dt=0;dt<m;++dt)me[dt]=ee[dt](Je+st),st+=P;var D;switch(b){case 0:D=Lt.toValue(Ie).apply(null,me);break;case 2:D=Reflect.construct(Lt.toValue(Ie),me);break;case 3:D=me[0];break;case 1:D=Lt.toValue(Ie)[Ph(ze)](...me);break}return Tg(Y,Ye,D)},Pe=`methodCaller<(${q.map(Ie=>Ie.name)}) => ${O.name}>`;return bg(Ht(Pe,Ee))};function Rg(m,g){return m>>>=0,g>>>=0,m=Lt.toValue(m),g=Lt.toValue(g),m==g}function Cg(m,g){return m>>>=0,g>>>=0,m=Lt.toValue(m),g=Lt.toValue(g),Lt.toHandle(m[g])}function Pg(m){m>>>=0,m>9&&(qt[m+1]+=1)}function Lg(m,g,b,P,O){return m>>>=0,g>>>=0,b>>>=0,P>>>=0,O>>>=0,Ul[m](g,b,P,O)}function Ig(m){return m>>>=0,Lt.toHandle(Ph(m))}function Dg(){return Lt.toHandle({})}function Ug(m){m>>>=0;var g=Lt.toValue(m);Z(g),wt(m)}function Ng(m,g,b){m>>>=0,g>>>=0,b>>>=0,m=Lt.toValue(m),g=Lt.toValue(g),b=Lt.toValue(b),m[g]=b}var Fg=()=>4294901760,Og=(m,g)=>Math.ceil(m/g)*g,Bg=m=>{var g=ra.buffer.byteLength,b=(m-g+65535)/65536|0;try{return ra.grow(b),be(),1}catch{}};function Vg(m){m>>>=0;var g=F.length,b=Fg();if(m>b)return!1;for(var P=1;P<=4;P*=2){var O=g*(1+.2/P);O=Math.min(O,m+100663296);var q=Math.min(b,Og(Math.max(m,O),65536)),Y=Bg(q);if(Y)return!0}return!1}var kg=(m,g)=>{if(Cr)for(var b=m;b<m+g;b++){var P=$(b);P&&Cr.set(P,b)}},Cr,zg=m=>(Cr||(Cr=new WeakMap,kg(0,io.length)),Cr.get(m)||0),Nl=[],Hg=()=>Nl.length?Nl.pop():io.grow(1),Fl=(m,g)=>io.set(m,g),Lh=m=>{const g=m.length;return[g%128|128,g>>7,...m]},Gg={i:127,p:127,j:126,f:125,d:124,e:111},Ih=m=>Lh(Array.from(m,g=>{var b=Gg[g];return b})),Wg=(m,g)=>{var b=Uint8Array.of(0,97,115,109,1,0,0,0,1,...Lh([1,96,...Ih(g.slice(1)),...Ih(g[0]==="v"?"":g[0])]),2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0),P=new WebAssembly.Module(b),O=new WebAssembly.Instance(P,{e:{f:m}}),q=O.exports.f;return q},Pr=(m,g)=>{var b=zg(m);if(b)return b;var P=Hg();try{Fl(P,m)}catch(q){if(!(q instanceof TypeError))throw q;var O=Wg(m,g);Fl(P,O)}return Cr.set(m,P),P},Lr=m=>{Cr.delete($(m)),Fl(m,null),Nl.push(m)};if(He(),Dl(),t.noExitRuntime&&t.noExitRuntime,t.print&&t.print,t.printErr&&(v=t.printErr),t.wasmBinary&&(x=t.wasmBinary),t.arguments&&t.arguments,t.thisProgram&&t.thisProgram,t.preInit)for(typeof t.preInit=="function"&&(t.preInit=[t.preInit]);t.preInit.length>0;)t.preInit.shift()();t.addFunction=Pr,t.removeFunction=Lr;var Dh,Ol,or,ra,io;function Xg(m){Dh=m.K,Ol=m.M,or=m.N,ra=m.I,io=m.L}var jg={l:ve,C:oe,q:Re,z:Ue,G:xt,j:qe,i:tn,a:At,E:En,x:Fn,d:_n,y:no,c:zi,p:eg,m:ng,h:ig,n:sg,F:hg,w:vg,r:xg,k:yg,H:Mg,u:Sg,g:wg,b:wt,o:Rg,B:Cg,t:Pg,f:Lg,s:Ig,A:Dg,e:Ug,v:Ng,D:Vg};function $g(m){m=Object.assign({},m);var g=P=>O=>P(O)>>>0,b=P=>()=>P()>>>0;return m.K=g(m.K),m.M=g(m.M),m._emscripten_stack_alloc=g(m._emscripten_stack_alloc),m.emscripten_stack_get_current=b(m.emscripten_stack_get_current),m}function qg(){H();function m(){var g;t.calledRun=!0,!_&&(Q(),A==null||A(t),(g=t.onRuntimeInitialized)==null||g.call(t),z())}t.setStatus?(t.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>t.setStatus(""),1),m()},1)):m()}var Ir;return Ir=await De(),qg(),de?e=t:e=new Promise((m,g)=>{A=m,R=g}),e}const IA="/assets/manifold-B_yLhOkb.wasm";let Nc=null,Fc=null;function DA(){return Nc?Promise.resolve(Nc):(Fc||(Fc=(async()=>{const n=await LA({locateFile:()=>IA});return n.setup(),Nc=n,n})()),Fc)}function tp(n,e,t){const i=new Float32Array(n.vertProperties),r=new Uint32Array(n.triVerts),s=i.length/3;return{id:`part-${e}`,name:e,kind:t,positions:i,original:i.slice(),indices:r,zoneOfVertex:new Uint8Array(s),stress:new Float32Array(s)}}function vi(n,e,t,i=0){let r=n.cube(e,!0);return i&&(r=r.rotate([0,i,0])),r.translate(t)}async function UA(){const n=await DA(),{Manifold:e}=n,t=e.cube([4.4,1.8,1.3],!0).translate([0,0,.8]),i=e.cube([4.2,1.6,1.1],!0).translate([0,0,.8]);let r=t.subtract(i);const s=e.cube([1.9,2.2,.5],!0).translate([0,0,1.1]);r=r.subtract(s);const o=e.cube([1.2,2.2,.8],!0).rotate([0,35,0]).translate([-1.35,0,1.35]),a=e.cube([1.2,2.2,.8],!0).rotate([0,-35,0]).translate([1.35,0,1.35]);r=r.subtract(o).subtract(a);const l=[];for(const x of[-.62,.62])l.push(vi(e,[1.3,.12,.16],[-1.45,x,.35])),l.push(vi(e,[1.3,.12,.16],[1.45,x,.35]));for(const x of[-.78,.78])l.push(vi(e,[2,.1,.2],[0,x,.32]));for(const x of[-.85,0,.85])l.push(vi(e,[.12,1.5,.1],[x,0,.3]));l.push(vi(e,[.12,1.6,.18],[-2.05,0,.42])),l.push(vi(e,[.12,1.6,.18],[2.05,0,.42]));for(const x of[-.72,.72])l.push(vi(e,[.09,.09,.75],[-.95,x,1],-18)),l.push(vi(e,[.09,.09,.75],[.95,x,1],18));for(const x of[-.72,.72])l.push(vi(e,[1.9,.08,.08],[0,x,1.42]));for(const x of[-.9,.9])l.push(vi(e,[.08,1.45,.07],[x,0,1.42]));const c=e.union(l),u=r.refineToLength(.22),h=c.refineToLength(.18),f=u.getMesh(),d=h.getMesh(),v={shell:r.volume(),beam:c.volume()};for(const x of l)x.delete();for(const x of[t,i,s,o,a,r,c,u,h])x.delete();return{parts:[tp(f,"外壳","shell"),tp(d,"内部梁","beam")],volumes:v}}const NA={class:"panel"},FA={class:"row"},OA={class:"file-btn"},BA=["disabled"],VA={key:0,class:"file-name"},kA={key:1,class:"error"},zA={class:"zone-bar"},HA=["title"],GA={class:"zone-table"},WA=["onUpdate:modelValue"],XA=["value","onChange"],jA=["value","onChange"],$A=["onUpdate:modelValue"],qA=["onClick"],YA={class:"row"},KA={class:"check"},ZA=is({__name:"ImportPanel",setup(n){function e(a){const l=Number(a.target.value);return Math.min(1,Math.max(0,l/100))}async function t(a){var c;const l=(c=a.target.files)==null?void 0:c[0];if(l){ce.loading=!0,ce.error="";try{const u=await MA(l);await Kd([u],l.name)}catch(u){ce.error=u instanceof Error?u.message:String(u)}finally{ce.loading=!1}a.target.value=""}}async function i(){ce.loading=!0,ce.error="";try{const{parts:a}=await UA();await Kd(a,"示例车架 (manifold-3d)")}catch(a){ce.error=a instanceof Error?a.message:String(a)}finally{ce.loading=!1}}let r=100;function s(){ce.zones.push({id:r++,name:`分区 ${ce.zones.length+1}`,xMin:0,xMax:1,yieldStrength:400,color:`#${Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}`})}function o(a){if(ce.zones.length<=1)return;const l=ce.zones.findIndex(c=>c.id===a);l>=0&&ce.zones.splice(l,1)}return(a,l)=>(Kt(),en("section",NA,[l[6]||(l[6]=Se("h2",null,[Se("span",{class:"step"},"①"),qn(" 车架导入与材料分区")],-1)),Se("div",FA,[Se("label",OA,[l[2]||(l[2]=qn(" 导入网格文件 ",-1)),Se("input",{type:"file",accept:".stl,.obj,.gltf,.glb",onChange:t,hidden:""},null,32)]),Se("button",{class:"btn secondary",disabled:Xe(ce).loading,onClick:i},Dt(Xe(ce).loading?"生成中…":"加载示例车架"),9,BA)]),l[7]||(l[7]=Se("p",{class:"hint"},"支持 STL / OBJ / GLTF / GLB;示例车架由 manifold-3d 布尔运算生成(半透明外壳 + 内部梁)。",-1)),Xe(Wn).fileName?(Kt(),en("p",VA,"当前:"+Dt(Xe(Wn).fileName),1)):Zr("",!0),Xe(ce).error?(Kt(),en("p",kA,Dt(Xe(ce).error),1)):Zr("",!0),Xe(ce).loaded?(Kt(),en(pn,{key:2},[l[5]||(l[5]=Se("h3",null,"材料分区(按车架 X 向区间)",-1)),Se("div",zA,[(Kt(!0),en(pn,null,Fo(Xe(ce).zones,c=>(Kt(),en("div",{key:c.id,class:"zone-seg",style:Xo({left:c.xMin*100+"%",width:(c.xMax-c.xMin)*100+"%",background:c.color}),title:c.name},null,12,HA))),128))]),Se("table",GA,[l[3]||(l[3]=Se("thead",null,[Se("tr",null,[Se("th",null,"分区"),Se("th",null,"起点%"),Se("th",null,"终点%"),Se("th",null,"屈服 MPa"),Se("th")])],-1)),Se("tbody",null,[(Kt(!0),en(pn,null,Fo(Xe(ce).zones,c=>(Kt(),en("tr",{key:c.id},[Se("td",null,[si(Se("input",{"onUpdate:modelValue":u=>c.name=u,class:"name-input"},null,8,WA),[[Jr,c.name]])]),Se("td",null,[Se("input",{type:"number",min:"0",max:"100",value:c.xMin*100,onChange:u=>c.xMin=e(u)},null,40,XA)]),Se("td",null,[Se("input",{type:"number",min:"0",max:"100",value:c.xMax*100,onChange:u=>c.xMax=e(u)},null,40,jA)]),Se("td",null,[si(Se("input",{type:"number",min:"1","onUpdate:modelValue":u=>c.yieldStrength=u},null,8,$A),[[Jr,c.yieldStrength,void 0,{number:!0}]])]),Se("td",null,[Se("button",{class:"mini",onClick:u=>o(c.id)},"✕",8,qA)])]))),128))])]),Se("div",YA,[Se("button",{class:"btn secondary",onClick:s},"+ 添加分区"),Se("button",{class:"btn",onClick:l[0]||(l[0]=(...c)=>Xe(Jd)&&Xe(Jd)(...c))},"应用分区"),Se("label",KA,[si(Se("input",{type:"checkbox","onUpdate:modelValue":l[1]||(l[1]=c=>Xe(ce).showZoneColors=c)},null,512),[[Ga,Xe(ce).showZoneColors]]),l[4]||(l[4]=qn(" 分区着色预览 ",-1))])])],64)):Zr("",!0)]))}}),to=(n,e)=>{const t=n.__vccOpts||n;for(const[i,r]of e)t[i]=r;return t},JA=to(ZA,[["__scopeId","data-v-1dc7aaea"]]),QA={class:"preset-grid"},ew=["onClick"],tw=["disabled"],nw=["disabled"],iw={class:"history"},rw=is({__name:"CollisionPanel",setup(n){const e=mm;return(t,i)=>(Kt(),en("section",{class:Ci(["panel",{disabled:!Xe(ce).loaded}])},[i[4]||(i[4]=Se("h2",null,[Se("span",{class:"step"},"②"),qn(" 碰撞施加与变形计算")],-1)),i[5]||(i[5]=Se("h3",null,"碰撞方向(6 预设)",-1)),Se("div",QA,[(Kt(!0),en(pn,null,Fo(Xe(e),(r,s)=>(Kt(),en("button",{key:r.name,class:Ci(["preset",{active:Xe(ce).presetIndex===s}]),onClick:o=>Xe(ce).presetIndex=s},Dt(r.name),11,ew))),128))]),Se("h3",null,"碰撞冲量:"+Dt(Xe(ce).impulse.toLocaleString())+" kN·s",1),si(Se("input",{type:"range",min:"1000",max:"30000",step:"500","onUpdate:modelValue":i[0]||(i[0]=r=>Xe(ce).impulse=r),class:"slider"},null,512),[[Jr,Xe(ce).impulse,void 0,{number:!0}]]),Se("button",{class:"btn primary big",disabled:!Xe(ce).loaded||Xe(ce).computing,onClick:i[1]||(i[1]=(...r)=>Xe(Zd)&&Xe(Zd)(...r))},Dt(Xe(ce).computing?"计算中…":"施加碰撞"),9,tw),Se("button",{class:"btn secondary",disabled:!Xe(ce).loaded||Xe(ce).computing,onClick:i[2]||(i[2]=(...r)=>Xe(Qd)&&Xe(Qd)(...r))}," 重置车架 ",8,nw),Xe(ce).collisions.length?(Kt(),en(pn,{key:0},[i[3]||(i[3]=Se("h3",null,"碰撞历史(对同一车架累积)",-1)),Se("ul",iw,[(Kt(!0),en(pn,null,Fo(Xe(ce).collisions,r=>(Kt(),en("li",{key:r.id}," #"+Dt(r.id)+" "+Dt(r.presetName)+" · "+Dt(r.impulse.toLocaleString())+" kN·s · 峰值 "+Dt(r.maxStress.toFixed(0))+" MPa · "+Dt(r.timeMs.toFixed(0))+" ms ",1))),128))])],64)):Zr("",!0)],2))}}),sw=to(rw,[["__scopeId","data-v-59d6da96"]]);function ow(n){const e=Math.min(1,Math.max(0,n)),t=[[.12,.23,.95],[0,.75,.95],[.1,.85,.3],[.98,.85,.1],[.95,.12,.08]],i=Math.min(t.length-2,Math.floor(e*(t.length-1))),r=e*(t.length-1)-i,s=t[i],o=t[i+1];return[s[0]+(o[0]-s[0])*r,s[1]+(o[1]-s[1])*r,s[2]+(o[2]-s[2])*r]}function aw(n,e,t){const i=t>1e-9?1/t:0;for(let r=0;r<n.length;r++){const[s,o,a]=ow(n[r]*i),l=r*3;e[l]=s,e[l+1]=o,e[l+2]=a}}const lw="linear-gradient(to right, rgb(31,59,242), rgb(0,191,242), rgb(26,217,77), rgb(250,217,26), rgb(242,31,20))",cw={class:"legend-labels"},uw={class:"check"},hw={key:0,class:"row"},fw={class:"check"},dw={class:"check"},pw={class:"check"},mw={class:"row axis-row"},gw=["onClick"],_w=["min","max","step","disabled"],vw=is({__name:"ComparePanel",setup(n){const e=["x","y","z"],t=lw,i=Qa(!0),r=Qa(1e3);_r([i,r],()=>{ce.stressCap=i.value?0:Math.max(1,r.value)});const s=Ro(()=>i.value?Math.max(ce.stats.maxStress,1).toFixed(0):r.value.toFixed(0));return(o,a)=>(Kt(),en("section",{class:Ci(["panel",{disabled:!Xe(ce).loaded}])},[a[12]||(a[12]=Se("h2",null,[Se("span",{class:"step"},"③"),qn(" 应力着色与剖切对比")],-1)),a[13]||(a[13]=Se("h3",null,"应力着色(蓝 → 红)",-1)),Se("div",{class:"legend",style:Xo({background:Xe(t)})},null,4),Se("div",cw,[a[6]||(a[6]=Se("span",null,"0",-1)),Se("span",null,Dt(s.value)+" MPa",1)]),Se("label",uw,[si(Se("input",{type:"checkbox","onUpdate:modelValue":a[0]||(a[0]=l=>i.value=l)},null,512),[[Ga,i.value]]),a[7]||(a[7]=qn(" 自动色标上限(当前最大应力) ",-1))]),i.value?Zr("",!0):(Kt(),en("div",hw,[si(Se("input",{type:"number",min:"1","onUpdate:modelValue":a[1]||(a[1]=l=>r.value=l),class:"cap-input"},null,512),[[Jr,r.value,void 0,{number:!0}]]),a[8]||(a[8]=Se("span",{class:"unit"},"MPa",-1))])),a[14]||(a[14]=Se("h3",null,"外壳显示",-1)),Se("label",fw,[a[9]||(a[9]=qn(" 外壳不透明度 ",-1)),si(Se("input",{type:"range",min:"0.05",max:"1",step:"0.01","onUpdate:modelValue":a[2]||(a[2]=l=>Xe(ce).shellOpacity=l),class:"slider inline"},null,512),[[Jr,Xe(ce).shellOpacity,void 0,{number:!0}]]),qn(" "+Dt(Xe(ce).shellOpacity.toFixed(2)),1)]),a[15]||(a[15]=Se("h3",null,"变形前后对比",-1)),Se("label",dw,[si(Se("input",{type:"checkbox","onUpdate:modelValue":a[3]||(a[3]=l=>Xe(ce).showGhost=l)},null,512),[[Ga,Xe(ce).showGhost]]),a[10]||(a[10]=qn(" 叠加原始车架(线框) ",-1))]),a[16]||(a[16]=Se("h3",null,"剖切平面",-1)),Se("label",pw,[si(Se("input",{type:"checkbox","onUpdate:modelValue":a[4]||(a[4]=l=>Xe(ce).clipEnabled=l)},null,512),[[Ga,Xe(ce).clipEnabled]]),a[11]||(a[11]=qn(" 启用剖切(查看内部梁弯曲) ",-1))]),Se("div",mw,[(Kt(),en(pn,null,Fo(e,l=>Se("button",{key:l,class:Ci(["axis-btn",{active:Xe(ce).clipAxis===l}]),onClick:c=>Xe(ce).clipAxis=l},Dt(l.toUpperCase())+" 轴 ",11,gw)),64))]),si(Se("input",{type:"range",min:Xe(ce).clipRange[0],max:Xe(ce).clipRange[1],step:(Xe(ce).clipRange[1]-Xe(ce).clipRange[0])/200||.01,"onUpdate:modelValue":a[5]||(a[5]=l=>Xe(ce).clipPos=l),class:"slider",disabled:!Xe(ce).clipEnabled},null,8,_w),[[Jr,Xe(ce).clipPos,void 0,{number:!0}]]),a[17]||(a[17]=Se("p",{class:"hint"},"也可在视口中直接拖拽橙色剖切面沿轴向移动。",-1))],2))}}),xw=to(vw,[["__scopeId","data-v-b47b7daf"]]),yw={class:"row"},Mw=is({__name:"ExportPanel",setup(n){const e=Qa("frame_crash");function t(){return Wn.parts}function i(){const[a,...l]=t();a&&bA(a,l,`${e.value}.stl`)}function r(){t().length&&EA(t(),`${e.value}.obj`)}function s(){t().length&&TA(t(),ce.zones.map(a=>a.name),`${e.value}_stress.csv`)}function o(){if(!t().length)return;const a=ce.stats;AA({source:Wn.fileName,exportedAt:new Date().toISOString(),materialZones:ce.zones,collisions:ce.collisions,stats:{vertexCount:a.vertexCount,triangleCount:a.triangleCount,initialVolume:a.initialVolume,currentVolume:a.currentVolume,volumeChange:a.currentVolume-a.initialVolume,volumeChangePct:a.initialVolume?(a.currentVolume-a.initialVolume)/a.initialVolume*100:0,maxStress:a.maxStress,maxStressPoint:a.maxStressPoint,maxStressZone:a.maxStressZone,exceededVertices:a.exceededVertices}},`${e.value}_report.json`)}return(a,l)=>(Kt(),en("section",{class:Ci(["panel",{disabled:!Xe(ce).loaded}])},[l[2]||(l[2]=Se("h2",null,[Se("span",{class:"step"},"④"),qn(" 变形网格与应力数据导出")],-1)),Se("div",yw,[l[1]||(l[1]=Se("span",{class:"label"},"文件名前缀",-1)),si(Se("input",{"onUpdate:modelValue":l[0]||(l[0]=c=>e.value=c),class:"prefix-input"},null,512),[[Jr,e.value]])]),Se("div",{class:"btn-col"},[Se("button",{class:"btn",onClick:i},"导出变形网格 STL"),Se("button",{class:"btn",onClick:r},"导出变形网格 OBJ"),Se("button",{class:"btn",onClick:s},"导出应力数据 CSV"),Se("button",{class:"btn",onClick:o},"导出碰撞报告 JSON")]),l[3]||(l[3]=Se("p",{class:"hint"},"STL/OBJ 导出当前变形后的几何;CSV 含每顶点坐标、应力与所属材料分区。",-1))],2))}}),Sw=to(Mw,[["__scopeId","data-v-ebf2e064"]]),bw={class:"stats"},Ew={class:"stress"},Tw={class:"mono"},Aw=is({__name:"StatsBar",setup(n){const e=ce.stats,t=Ro(()=>e.currentVolume-e.initialVolume),i=Ro(()=>e.initialVolume?t.value/e.initialVolume*100:0),r=Ro(()=>t.value<-1e-6?"warn":"");return(s,o)=>(Kt(),en("aside",bw,[o[10]||(o[10]=Se("h2",null,"计算结果",-1)),Se("dl",null,[o[0]||(o[0]=Se("dt",null,"顶点数 / 三角面",-1)),Se("dd",null,Dt(Xe(e).vertexCount.toLocaleString())+" / "+Dt(Xe(e).triangleCount.toLocaleString()),1),o[1]||(o[1]=Se("dt",null,"碰撞次数",-1)),Se("dd",null,Dt(Xe(e).collisionCount),1),o[2]||(o[2]=Se("dt",null,"初始体积",-1)),Se("dd",null,Dt(Xe(e).initialVolume.toFixed(4))+" m³",1),o[3]||(o[3]=Se("dt",null,"当前体积",-1)),Se("dd",null,Dt(Xe(e).currentVolume.toFixed(4))+" m³",1),o[4]||(o[4]=Se("dt",null,"体积变化",-1)),Se("dd",{class:Ci(r.value)},Dt(t.value>=0?"+":"")+Dt(t.value.toFixed(4))+" m³ ("+Dt(t.value>=0?"+":"")+Dt(i.value.toFixed(2))+"%) ",3),o[5]||(o[5]=Se("dt",null,"最大应力",-1)),Se("dd",Ew,Dt(Xe(e).maxStress.toFixed(1))+" MPa",1),o[6]||(o[6]=Se("dt",null,"最大应力点位置",-1)),Se("dd",Tw," ("+Dt(Xe(e).maxStressPoint[0].toFixed(3))+", "+Dt(Xe(e).maxStressPoint[1].toFixed(3))+", "+Dt(Xe(e).maxStressPoint[2].toFixed(3))+") ",1),o[7]||(o[7]=Se("dt",null,"所在分区",-1)),Se("dd",null,Dt(Xe(e).maxStressZone||"—"),1),o[8]||(o[8]=Se("dt",null,"超屈服顶点数",-1)),Se("dd",{class:Ci({warn:Xe(e).exceededVertices>0})},Dt(Xe(e).exceededVertices.toLocaleString()),3),o[9]||(o[9]=Se("dt",null,"单次重算耗时",-1)),Se("dd",null,Dt(Xe(e).lastComputeMs.toFixed(0))+" ms",1)])]))}}),ww=to(Aw,[["__scopeId","data-v-82d6c990"]]),np={type:"change"},Ah={type:"start"},Qm={type:"end"},Va=new Zs,ip=new Si,Rw=Math.cos(70*Pm.DEG2RAD),an=new k,On=2*Math.PI,kt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Oc=1e-6;class Cw extends $y{constructor(e,t=null){super(e,t),this.state=kt.NONE,this.enabled=!0,this.target=new k,this.cursor=new k,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ls.ROTATE,MIDDLE:Ls.DOLLY,RIGHT:Ls.PAN},this.touches={ONE:ws.ROTATE,TWO:ws.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new k,this._lastQuaternion=new Ui,this._lastTargetPosition=new k,this._quat=new Ui().setFromUnitVectors(e.up,new k(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new hd,this._sphericalDelta=new hd,this._scale=1,this._panOffset=new k,this._rotateStart=new lt,this._rotateEnd=new lt,this._rotateDelta=new lt,this._panStart=new lt,this._panEnd=new lt,this._panDelta=new lt,this._dollyStart=new lt,this._dollyEnd=new lt,this._dollyDelta=new lt,this._dollyDirection=new k,this._mouse=new lt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Lw.bind(this),this._onPointerDown=Pw.bind(this),this._onPointerUp=Iw.bind(this),this._onContextMenu=Vw.bind(this),this._onMouseWheel=Nw.bind(this),this._onKeyDown=Fw.bind(this),this._onTouchStart=Ow.bind(this),this._onTouchMove=Bw.bind(this),this._onMouseDown=Dw.bind(this),this._onMouseMove=Uw.bind(this),this._interceptControlDown=kw.bind(this),this._interceptControlUp=zw.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(np),this.update(),this.state=kt.NONE}update(e=null){const t=this.object.position;an.copy(t).sub(this.target),an.applyQuaternion(this._quat),this._spherical.setFromVector3(an),this.autoRotate&&this.state===kt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=On:i>Math.PI&&(i-=On),r<-Math.PI?r+=On:r>Math.PI&&(r-=On),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(an.setFromSpherical(this._spherical),an.applyQuaternion(this._quatInverse),t.copy(this.target).add(an),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=an.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new k(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new k(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=an.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Va.origin.copy(this.object.position),Va.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Va.direction))<Rw?this.object.lookAt(this.target):(ip.setFromNormalAndCoplanarPoint(this.object.up,this.target),Va.intersectPlane(ip,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Oc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Oc||this._lastTargetPosition.distanceToSquared(this.target)>Oc?(this.dispatchEvent(np),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?On/60*this.autoRotateSpeed*e:On/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){an.setFromMatrixColumn(t,0),an.multiplyScalar(-e),this._panOffset.add(an)}_panUp(e,t){this.screenSpacePanning===!0?an.setFromMatrixColumn(t,1):(an.setFromMatrixColumn(t,0),an.crossVectors(this.object.up,an)),an.multiplyScalar(e),this._panOffset.add(an)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;an.copy(r).sub(this.target);let s=an.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(On*this._rotateDelta.x/t.clientHeight),this._rotateUp(On*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(On*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-On*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(On*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-On*this.rotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(On*this._rotateDelta.x/t.clientHeight),this._rotateUp(On*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new lt,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Pw(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Lw(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Iw(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Qm),this.state=kt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Dw(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ls.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=kt.DOLLY;break;case Ls.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=kt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=kt.ROTATE}break;case Ls.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=kt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=kt.PAN}break;default:this.state=kt.NONE}this.state!==kt.NONE&&this.dispatchEvent(Ah)}function Uw(n){switch(this.state){case kt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case kt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case kt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Nw(n){this.enabled===!1||this.enableZoom===!1||this.state!==kt.NONE||(n.preventDefault(),this.dispatchEvent(Ah),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Qm))}function Fw(n){this.enabled!==!1&&this._handleKeyDown(n)}function Ow(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ws.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=kt.TOUCH_ROTATE;break;case ws.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=kt.TOUCH_PAN;break;default:this.state=kt.NONE}break;case 2:switch(this.touches.TWO){case ws.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=kt.TOUCH_DOLLY_PAN;break;case ws.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=kt.TOUCH_DOLLY_ROTATE;break;default:this.state=kt.NONE}break;default:this.state=kt.NONE}this.state!==kt.NONE&&this.dispatchEvent(Ah)}function Bw(n){switch(this._trackPointer(n),this.state){case kt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case kt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case kt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case kt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=kt.NONE}}function Vw(n){this.enabled!==!1&&n.preventDefault()}function kw(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function zw(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Hw={key:0,class:"viewport-hint"},Gw={key:1,class:"computing-mask"},Ww=is({__name:"Viewport",setup(n){const e=Qa();let t,i,r,s,o,a,l,c,u=0,h=null,f=[];const d=new Si(new k(-1,0,0),0),v={x:new k(1,0,0),y:new k(0,1,0),z:new k(0,0,1)};let x=!1;const _=new Si,p=new Wy,A=new lt;function R(){const H=e.value;t=new PT({antialias:!0}),t.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.localClippingEnabled=!0,H.appendChild(t.domElement),i=new ey,i.background=new tt(1316895),r=new In(50,1,.01,200),r.up.set(0,0,1),r.position.set(5.5,-6.5,4),s=new Cw(r,t.domElement),s.enableDamping=!0,s.target.set(0,0,.6),i.add(new wy(14674175,2764083,1.1));const Q=new Fu(16777215,1.6);Q.position.set(4,-3,6),i.add(Q);const z=new Fu(8956671,.5);z.position.set(-4,3,2),i.add(z);const ge=new Xy(12,24,3818326,2567482);ge.rotation.x=Math.PI/2,i.add(ge),i.add(new jy(1.2)),o=new Ai,a=new Ai,i.add(o),i.add(a),l=new cn(new Ko(1,1),new Ti({color:16747546,transparent:!0,opacity:.18,side:Yn,depthWrite:!1})),l.visible=!1,l.renderOrder=20,i.add(l),c=new cn(new xh(.05,16,16),new Ti({color:16720418,depthTest:!1})),c.renderOrder=30,c.visible=!1,i.add(c),t.domElement.addEventListener("pointerdown",ne),window.addEventListener("pointermove",de),window.addEventListener("pointerup",be),h=new ResizeObserver(M),h.observe(H),M(),F()}function M(){const H=e.value;if(!H||!t)return;const Q=H.clientWidth,z=H.clientHeight;t.setSize(Q,z),r.aspect=Q/Math.max(1,z),r.updateProjectionMatrix()}function F(){u=requestAnimationFrame(F),s.update(),t.render(i,r)}function I(H){var Q;for(const z of[...H.children]){const ge=z;(Q=ge.geometry)==null||Q.dispose();const Ae=ge.material;Array.isArray(Ae)?Ae.forEach(ke=>ke.dispose()):Ae==null||Ae.dispose(),H.remove(z)}}function U(){I(o),I(a),f=[];for(const H of Wn.parts){const Q=new sn;Q.setAttribute("position",new Jt(H.positions,3));const z=new Float32Array(H.positions.length);Q.setAttribute("color",new Jt(z,3)),Q.setIndex(new Jt(H.indices,1)),Q.computeVertexNormals();const ge=H.kind==="shell",Ae=new Tl({vertexColors:!0,roughness:ge?.35:.55,metalness:ge?.2:.55,transparent:ge,opacity:ge?ce.shellOpacity:1,depthWrite:!ge,side:ge?Yn:Di}),ke=new cn(Q,Ae);ke.renderOrder=ge?10:0,o.add(ke);const Ze=new sn;Ze.setAttribute("position",new Jt(H.original,3)),Ze.setIndex(new Jt(H.indices,1)),Ze.computeVertexNormals();const Mt=new cn(Ze,new Ti({color:9413565,transparent:!0,opacity:.15,depthWrite:!1,wireframe:!0}));Mt.renderOrder=5,Mt.visible=ce.showGhost,a.add(Mt),f.push({part:H,mesh:ke,ghost:Mt,colors:z,material:Ae})}Ja(),w(),B(),W()}function W(){const H=new pi().setFromObject(o);if(H.isEmpty())return;const Q=H.getCenter(new k),z=H.getSize(new k).length();s.target.copy(Q),r.position.copy(Q).add(new k(.9,-1.1,.7).normalize().multiplyScalar(z*1.1)),r.near=z/500,r.far=z*20,r.updateProjectionMatrix()}function w(){var Q;const H=ce.stressCap>0?ce.stressCap:Math.max(ce.stats.maxStress,...ce.zones.map(z=>z.yieldStrength),1);for(const z of f){if(ce.showZoneColors){const ge=new tt;for(let Ae=0;Ae<z.part.zoneOfVertex.length;Ae++)ge.set(((Q=ce.zones[z.part.zoneOfVertex[Ae]])==null?void 0:Q.color)??"#888888"),z.colors[Ae*3]=ge.r,z.colors[Ae*3+1]=ge.g,z.colors[Ae*3+2]=ge.b}else aw(z.part.stress,z.colors,H);z.mesh.geometry.getAttribute("color").needsUpdate=!0}}function E(){for(const H of f){const Q=H.mesh.geometry.getAttribute("position");Q.needsUpdate=!0,H.mesh.geometry.computeVertexNormals(),H.mesh.geometry.computeBoundingSphere()}w(),Ja(),ce.stats.maxStress>0?(c.position.set(...ce.stats.maxStressPoint),c.visible=!0):c.visible=!1}function B(){const H=ce.clipEnabled,Q=v[ce.clipAxis];d.normal.copy(Q).negate(),d.constant=ce.clipPos;for(const z of f){z.material.clippingPlanes=H?[d]:null,z.material.needsUpdate=!0;const ge=z.ghost.material;ge.clippingPlanes=H?[d]:null,ge.needsUpdate=!0}if(l.visible=H,H){const z=new pi().setFromObject(o),ge=z.getSize(new k),Ae=ce.clipAxis==="x"?[ge.y,ge.z]:ce.clipAxis==="y"?[ge.x,ge.z]:[ge.x,ge.y];l.scale.set(Math.max(Ae[0],.5)*1.1,Math.max(Ae[1],.5)*1.1,1),l.rotation.set(0,0,0),ce.clipAxis==="x"?l.rotation.y=Math.PI/2:ce.clipAxis==="y"&&(l.rotation.x=Math.PI/2);const ke=z.getCenter(new k);l.position.copy(ke);const Ze={x:0,y:1,z:2}[ce.clipAxis];l.position.setComponent(Ze,ce.clipPos)}}function ue(H){const Q=t.domElement.getBoundingClientRect();A.set((H.clientX-Q.left)/Q.width*2-1,-((H.clientY-Q.top)/Q.height)*2+1)}function ne(H){if(!ce.clipEnabled||!l.visible)return;ue(H),p.setFromCamera(A,r);const Q=p.intersectObject(l,!1);if(!Q.length)return;x=!0,s.enabled=!1;const z=v[ce.clipAxis],ge=r.getWorldDirection(new k),Ae=new k().crossVectors(z,ge).cross(z).normalize();_.setFromNormalAndCoplanarPoint(Ae,Q[0].point),t.domElement.setPointerCapture(H.pointerId)}function de(H){if(!x)return;ue(H),p.setFromCamera(A,r);const Q=new k;if(!p.ray.intersectPlane(_,Q))return;const z=v[ce.clipAxis],ge=Q.dot(z),[Ae,ke]=ce.clipRange;ce.clipPos=Math.min(ke,Math.max(Ae,ge))}function be(){x&&(x=!1,s.enabled=!0)}return zp(()=>{R(),ce.loaded&&U()}),Hp(()=>{cancelAnimationFrame(u),h==null||h.disconnect(),window.removeEventListener("pointermove",de),window.removeEventListener("pointerup",be),t==null||t.dispose()}),_r(()=>ce.loaded,H=>H&&U()),_r(()=>ce.viewVersion,E),_r(()=>[ce.showGhost,ce.shellOpacity,ce.showZoneColors,ce.stressCap],()=>{for(const H of f)H.ghost.visible=ce.showGhost,H.part.kind==="shell"&&(H.material.opacity=ce.shellOpacity);w()}),_r(()=>[ce.clipEnabled,ce.clipAxis,ce.clipPos],()=>{Ja(),B()}),(H,Q)=>(Kt(),en("div",{ref_key:"container",ref:e,class:"viewport"},[Xe(ce).loaded?Zr("",!0):(Kt(),en("div",Hw,[...Q[0]||(Q[0]=[Se("p",null,"请在左侧「① 车架导入与材料分区」中导入网格或加载示例车架",-1)])])),Xe(ce).computing?(Kt(),en("div",Gw,"碰撞变形计算中…")):Zr("",!0)],512))}}),Xw=to(Ww,[["__scopeId","data-v-a1e0cd3f"]]),jw={class:"app"},$w={class:"body"},qw={class:"sidebar"},Yw={class:"main"},Kw=is({__name:"App",setup(n){return(e,t)=>(Kt(),en("div",jw,[t[0]||(t[0]=Se("header",{class:"topbar"},[Se("h1",null,"车架碰撞变形与应力可视化"),Se("span",{class:"sub"},"Vue3 · TypeScript · three.js · manifold-3d")],-1)),Se("div",$w,[Se("div",qw,[Ln(JA),Ln(sw),Ln(xw),Ln(Sw)]),Se("main",Yw,[Ln(Xw)]),Ln(ww)])]))}});yv(Kw).mount("#app");
