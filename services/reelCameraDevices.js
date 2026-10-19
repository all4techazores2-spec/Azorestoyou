export function mainRearCamera(devices) {
    const excluded=/ultra|telephoto|telefoto|teleobjetiva|telelens|depth|macro|infrared|triple|dual/i;
    return devices.filter(d=>d.kind==='videoinput'&&!excluded.test(d.label)&&/back|rear|traseira|arrière|ruck|rück|environment|ambiente/i.test(d.label))
        .map(device=>({device,score:/main|principal|primary|wide|grande.angle/i.test(device.label)?100:/camera\s*0\b|camera$/i.test(device.label)?80:30}))
        .sort((a,b)=>b.score-a.score)[0]?.device;
}
export async function openNormalCamera(mediaDevices, facing, audio, cancelled=()=>false) {
    const video={width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30},resizeMode:{ideal:'none'}};
    const acquire=()=>mediaDevices.getUserMedia({video:{...video,facingMode:{ideal:facing}},audio});
    let stream=await acquire();
    const stop=()=>stream.getTracks().forEach(track=>track.stop());
    const check=()=>{if(cancelled()){stop();throw new DOMException('Câmara fechada.','AbortError');}};
    check();
    try {
        if(facing==='environment'){
            let devices=[];try{devices=await mediaDevices.enumerateDevices();}catch{}
            check();const main=mainRearCamera(devices);
            if(main&&main.deviceId!==stream.getVideoTracks()[0]?.getSettings?.().deviceId){
                stop();
                try{stream=await mediaDevices.getUserMedia({video:{...video,deviceId:{exact:main.deviceId}},audio});}
                catch{stream=await acquire();}
                check();
            }
        }
        const track=stream.getVideoTracks()[0];
        const zoom=track?.getCapabilities?.().zoom;
        if(zoom&&Number.isFinite(zoom.min)&&Number.isFinite(zoom.max)){
            const normal=Math.min(zoom.max,Math.max(zoom.min,1));
            try{await track.applyConstraints({advanced:[{zoom:normal}]});}catch{}
        }
        check();return stream;
    }catch(error){stop();throw error;}
}
