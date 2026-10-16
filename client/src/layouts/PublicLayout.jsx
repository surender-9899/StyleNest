import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { trackVisit } from '../utils/analytics'
export default function PublicLayout(){useEffect(()=>{trackVisit()},[location.pathname]); return <><Header/><main className="min-h-[70vh]"><Outlet/></main><Footer/></>}
