export function cloudinaryDeliveryUrl(value='', width=1080) {
    try {
        const url=new URL(value);
        if(url.protocol!=='https:'||url.hostname!=='res.cloudinary.com'||/\/s--[^/]+--\//.test(url.pathname))return value;
        const match=url.pathname.match(/^(\/[^/]+\/(image|video)\/upload\/)(.*)$/);
        if(!match)return value;
        const video=match[2]==='video'&&!/\.(jpg|jpeg|png|webp|avif)(?:$|\?)/i.test(match[3]);
        const transform=video?'f_mp4,vc_h264,q_auto,w_720,c_limit':`f_auto,q_auto,w_${Math.min(1920,Math.max(100,width))},c_limit`;
        if(match[3].startsWith(transform+'/'))return value;
        url.pathname=match[1]+transform+'/'+match[3];return url.href;
    }catch{return value;}
}
export function cloudinaryVideoPoster(value='') {
    try{const url=new URL(value);if(url.hostname!=='res.cloudinary.com'||!url.pathname.includes('/video/upload/')||/\/s--[^/]+--\//.test(url.pathname))return '';
        url.pathname=url.pathname.replace('/video/upload/','/video/upload/so_0,f_jpg,q_auto,w_480,c_limit/').replace(/\.[a-z0-9]+$/i,'.jpg');return url.href;
    }catch{return '';}
}
