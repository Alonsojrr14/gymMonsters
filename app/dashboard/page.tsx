import dynamic from "next/dynamic"

const DashboardComponent = dynamic(() => import("./DashboardComponent"), { ssr: false })

export default function Page() {
  return <DashboardComponent />
}
