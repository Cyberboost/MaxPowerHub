import './styles.css';
export const metadata = {
  title:'PowerHub AI by CyberBoost | Power Platform field guide',
  description:'Curated Microsoft Power Platform resources and citation-first guidance for makers, developers, and teams.',
  robots:{index:false,follow:false},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
