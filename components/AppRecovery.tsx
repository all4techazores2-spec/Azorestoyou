import React,{useEffect,useState} from 'react';
export function ConnectionNotice(){
  const [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{const update=(event:Event)=>setUnavailable(!!(event as CustomEvent).detail?.unavailable);window.addEventListener('app-connection-status',update);return()=>window.removeEventListener('app-connection-status',update);},[]);
  if(!unavailable)return null;
  return <div role="status" style={{position:'fixed',left:12,right:12,bottom:82,zIndex:10000,margin:'auto',maxWidth:620,display:'flex',alignItems:'center',gap:14,padding:'13px 16px',border:'1px solid #dbe6ef',borderRadius:14,background:'#fff',color:'#243b53',boxShadow:'0 6px 28px #12294022',fontSize:12}}><span style={{flex:1}}>Não foi possível atualizar os dados. Mantemos a informação disponível e tentamos ligar novamente.</span><button onClick={()=>window.dispatchEvent(new Event('app-retry-sync'))} style={{background:'#0078f6',color:'#fff',border:0,borderRadius:9,padding:'9px 12px',whiteSpace:'nowrap'}}>Tentar novamente</button></div>;
}
export class AppRecoveryBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
  declare props:{children:React.ReactNode};
  state={failed:false};
  static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(error:Error){console.error('Não foi possível apresentar a página:',error);}
  render(){if(!this.state.failed)return this.props.children;return <main style={{minHeight:'100dvh',display:'grid',placeItems:'center',padding:24,background:'#f4f8fc',color:'#163450'}}><section style={{maxWidth:420,padding:30,borderRadius:22,background:'#fff',textAlign:'center'}}><h1 style={{fontSize:21}}>Não foi possível abrir esta página</h1><p style={{fontSize:14,lineHeight:1.7,margin:'16px 0'}}>Ocorreu uma falha ao apresentar os dados. Tenta carregar a aplicação novamente.</p><button onClick={()=>window.location.reload()} style={{border:0,borderRadius:11,background:'#0078f6',color:'#fff',padding:'12px 20px'}}>Recarregar aplicação</button></section></main>;}
}
