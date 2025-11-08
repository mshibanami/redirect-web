uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D uTexture;
uniform float u_isDarkMode;
varying vec2 vUv;

vec4 applyBlur(sampler2D tex, vec2 uv, float amount) {
    vec4 color = vec4(0.0);
    float total = 0.0;
    float offset = amount * 0.01;
    
    for(float x = -4.0; x <= 4.0; x++) {
        for(float y = -4.0; y <= 4.0; y++) {
            vec2 offsetUV = uv + vec2(x, y) * offset;
            float weight = 1.0 - (abs(x) + abs(y)) / 8.0;
            color += texture2D(tex, offsetUV) * weight;
            total += weight;
        }
    }
    
    return color / total;
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(
        0.211324865405187,
        0.366025403784439,
        -0.577350269189626,
        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;

    return 130.0 * dot(m, g);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float timeFactor = 0.7;
    float time = u_time * timeFactor;
    float slowTime = time * 0.5;
    float aspectRatio = u_resolution.x / u_resolution.y;
    vec2 pos = st - 0.5;
    pos.x *= aspectRatio;
    pos *= 0.5;
    vec2 warp = vec2(
        snoise(pos * 1.2 + time * 0.15),
        snoise(pos * 1.2 + time * 0.12)
    ) * 0.4;
    float n1 = snoise((pos + warp) * 1.5 + vec2(time * 0.4, time * 0.3));
    float n2 = snoise((pos - warp * 0.5) * 2.5 - vec2(time * 0.3, time * 0.4)) * 0.5;
    float n3 = snoise(pos * 0.8 + vec2(slowTime * 0.2, -slowTime * 0.15)) * 0.3;
    float n4 = snoise(pos * 3.5 + vec2(time * 0.5, time * 0.6)) * 0.2;
    float noise = (n1 + n2 + n3 + n4) * 0.5 + 0.5;

    // Light mode colors
    vec3 color1_light = vec3(0.90, 0.94, 1.00);
    vec3 color2_light = vec3(0.82, 0.90, 1.00);
    vec3 color3_light = vec3(0.78, 0.86, 0.98);
    vec3 accent_light = vec3(0.70, 0.82, 0.98);
    vec3 highlight_light = vec3(0.92, 0.96, 1.00);
    
    // Dark mode colors
    vec3 color1_dark = vec3(0.12, 0.16, 0.28);
    vec3 color2_dark = vec3(0.18, 0.22, 0.38);
    vec3 color3_dark = vec3(0.16, 0.20, 0.35);
    vec3 accent_dark = vec3(0.25, 0.32, 0.48);
    vec3 highlight_dark = vec3(0.32, 0.40, 0.55);
    
    // Blend between light and dark mode colors
    vec3 color1 = mix(color1_light, color1_dark, u_isDarkMode);
    vec3 color2 = mix(color2_light, color2_dark, u_isDarkMode);
    vec3 color3 = mix(color3_light, color3_dark, u_isDarkMode);
    vec3 accent = mix(accent_light, accent_dark, u_isDarkMode);
    vec3 highlight = mix(highlight_light, highlight_dark, u_isDarkMode);
    float pulse = sin(slowTime * 0.5) * 0.5 + 0.5;
    vec3 color = mix(color1, color2, smoothstep(0.2, 0.8, noise));
    color = mix(color, color3, smoothstep(0.3, 0.9, n2 * 0.5 + 0.5));
    color = mix(color, accent, smoothstep(0.5, 0.95, n3 * 0.5 + 0.5) * 0.4);
    color = mix(color, highlight, smoothstep(0.7, 1.0, n4 * 0.5 + 0.5) * pulse * 0.3);
    float vignette = 1.0 - length(st - 0.5) * (pulse * 0.00001);
    color *= vignette;
    color += vec3(0.02) * sin(noise * 6.28 + time) * 0.5;
    
    float alpha = smoothstep(0.0, 2.5, st.y);
    
    gl_FragColor = vec4(color, alpha);
}
