import "./index.css";
import MaterialsCloudHeader from "mc-react-header";
import { McAppHeader } from "mc-react-library";
import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useMatch } from "react-router-dom";

import { Loading } from "./Autowannier/Common.jsx";
import Dashboard from "./Autowannier/Dashboard/index.jsx";
import CompoundsList from "./Autowannier/Dashboard/List.jsx";
import CompoundsPlot from "./Autowannier/Dashboard/Plot.jsx";
import CompoundsPTable from "./Autowannier/Dashboard/PTable.jsx";

// the compound page (3D viewer, bands): loaded when first opened
const Details = lazy(() => import("./Autowannier/Details/index.jsx"));

const TITLE = "Automated high-throughput Wannierisation";

// The routes of the old section (/autowannier/dashboard/ptable|list|plot,
// /autowannier/details/<compound>), relative to where the app is served.
export default function App() {
  // on a compound's page the breadcrumb ends with it, the section links back to the dashboard
  const compound = useMatch("/details/:compound")?.params.compound;
  return (
    <>
      <MaterialsCloudHeader
        activeSection="discover"
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          { name: "Automated Wannierisation", link: compound ? `${import.meta.env.BASE_URL}dashboard/ptable` : null },
          ...(compound ? [{ name: compound, link: null }] : []),
        ]}
      />
      <main className="min-h-screen bg-[aliceblue] pb-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="overflow-hidden bg-white p-4 shadow-sm">
            <McAppHeader
              title={
                <Link to="/" className="text-inherit hover:no-underline">
                  {TITLE}
                </Link>
              }
              logo={`${import.meta.env.BASE_URL}scdm.png`}
              logoAlt="Automated Wannierisation logo"
              dois={["10.24435/materialscloud:dd-nz"]}
            />
            <div className="mt-4">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="ptable" element={<CompoundsPTable />} />
                  <Route path="list" element={<CompoundsList />} />
                  <Route path="plot" element={<CompoundsPlot />} />
                  <Route index element={<Navigate to="ptable" replace />} />
                </Route>
                <Route
                  path="/details/:compound"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Details />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard/ptable" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
