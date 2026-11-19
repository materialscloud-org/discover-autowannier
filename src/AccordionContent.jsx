// The information accordions of the dashboard (the old about.html, cite.html, ack.html).
import { useState } from "react";
import { DoiBadge, McInfoAccordion } from "mc-react-library";

const PAPER = (
  <>
    Valerio Vitale, Giovanni Pizzi, Antimo Marrazzo, Jonathan R. Yates, Nicola Marzari, Arash A. Mostofi,{" "}
    <i>npj Computational Materials</i> <b>6</b>, 66 (2020){" "}
    <span className="inline-block align-middle">
      <DoiBadge doi="10.1038/s41524-020-0312-y" label="npj Comput. Mater." />
    </span>
  </>
);

function AboutContent() {
  return (
    <div className="space-y-2">
      <p>
        This section contains the results from the validation of a procedure for automatically generating
        maximally-localized Wannier functions in a high-throughput framework.
      </p>
      <p>
        Maximally-localised Wannier functions (MLWFs) are routinely used to compute from first-principles advanced
        materials properties that require very dense Brillouin zone integration and to build accurate tight-binding
        models for scale-bridging simulations. At the same time, high-throughput (HT) computational materials design
        is an emergent field that promises to accelerate the reliable and cost-effective design and optimisation of
        new materials with target properties. The use of MLWFs in HT workflows has been hampered by the fact that
        generating MLWFs automatically and robustly without any user intervention and for arbitrary materials is, in
        general, very challenging. We address this problem directly by proposing a procedure for automatically
        generating MLWFs for HT frameworks. Our approach is based on the selected columns of the density matrix
        method and we present the details of its implementation in an AiiDA workflow. We apply our approach to a
        dataset of 200 bulk crystalline materials that span a wide structural and chemical space. We assess the
        quality of our MLWFs in terms of the accuracy of the band-structure interpolation that they provide as
        compared to the band-structure obtained via full first-principles calculations. Finally, we provide a
        downloadable <a href="https://doi.org/10.24435/materialscloud:dd-nz">virtual machine</a> that allows to
        reproduce the results of our paper, including all first-principles and atomistic simulations as well as the
        computational workflows.
      </p>
      <p>In this section, for all the materials we studied we provide:</p>
      <ul className="list-disc pl-8 text-sm">
        <li>optimised crystal structure (variable-cell relaxation)</li>
        <li>electronic band structure obtained with Quantum ESPRESSO at the DFT-PBE level</li>
        <li>interpolated band structure obtained with Wannier90</li>
        <li>
          bands distance (η, η<sub>max</sub>) and total localization spread (Ω)
        </li>
        <li>
          comparison between different linear k-point spacings (0.15, 0.2, 0.3, 0.4 Å<sup>-1</sup>) and techniques
          (SCDM with/without MLWF, random projections with MLWF)
        </li>
      </ul>
      <p>More details can be found in: {PAPER}</p>
    </div>
  );
}

function HowToCiteContent() {
  return <p>{PAPER}</p>;
}

const REFERENCES = {
  Software: [
    <>
      (AiiDA) G. Pizzi <i>et al.</i>, Comp. Mat. Sci. 111, 218 (2016). <a href="http://www.aiida.net">aiida.net</a>
    </>,
    <>
      (Quantum ESPRESSO) P. Giannozzi <i>et al.</i>, J. Phys. Cond. Matt. 21, 395502 (2009).
    </>,
    <>
      (Quantum ESPRESSO) P. Giannozzi <i>et al.</i>, J. Phys. Cond. Matt. 29, 465901 (2017).
    </>,
    <>
      (aiida-quantumespresso) S. P. Huber for the Quantum ESPRESSO workchains{" "}
      <a href="https://github.com/aiidateam/aiida-quantumespresso">github.com/aiidateam/aiida-quantumespresso</a>
    </>,
    <>
      (TBmodels) D. Gresch <i>et al.</i>, Phys. Rev. Mat. 2, 103805 (2018).
    </>,
    <>
      (SeeK-path) Y. Hinuma <i>et al.</i>, Comp. Mat. Sci. 128, 140 (2017).{" "}
      <a href="https://materialscloud.org/work/tools/seekpath">materialscloud.org/work/tools/seekpath</a>
    </>,
  ],
  Pseudopotentials: [
    <>
      G. Prandini <i>et al.</i>, npj Computational Materials 4, 72 (2018).
    </>,
    <>
      K. F. Garrity <i>et al.</i>, Comput. Mater. Sci. 81, 446 (2014).
    </>,
    <>M. Schlipf and F. Gygi, Comp. Phys. Comm. 196, 36 (2015).</>,
    <>
      A. Willand <i>et al.</i>, J. Chem. Phys. 138, 104109 (2013).
    </>,
    <>
      E. Küçükbenli <i>et al.</i>, <a href="https://arxiv.org/abs/1404.3015">arXiv:1404.3015</a> (2014).
    </>,
    <>A. Dal Corso, Comput. Mater. Sci. 95, 337 (2014).</>,
    <>
      M. J. van Setten <i>et al.</i>, Comp. Phys. Comm. 226, 39 (2018).
    </>,
  ],
  "SCDM method": [
    <>A. Damle and L. Lin, Multiscale Model. Simul. 16, 1392 (2018).</>,
    <>
      A. Damle <i>et al.</i>, J. Chem. Theory Comp. 11, 1463 (2015).
    </>,
  ],
};

function AcknowledgementsContent() {
  let n = 0;
  return (
    <div className="space-y-3 text-sm">
      <h4 className="font-semibold">HPC support</h4>
      <p>
        PRACE for awarding access to computing resources on Marconi at CINECA (Italy) and on Piz Daint at CSCS
        (Switzerland).
      </p>
      <h4 className="font-semibold">Funding</h4>
      <ul className="list-disc pl-8">
        <li>
          European Union&apos;s Horizon 2020 research and innovation program under grant agreement no. 676531
          (project E-CAM)
        </li>
        <li>NCCR MARVEL of the Swiss National Science Foundation</li>
        <li>European Union&apos;s Centre of Excellence MaX “Materials design at the Exascale” (grant no. 824143)</li>
        <li>Thomas Young Centre under grant TYC-101</li>
      </ul>
      {Object.entries(REFERENCES).map(([title, refs]) => (
        <div key={title}>
          <h4 className="font-semibold">{title}</h4>
          {refs.map((ref) => {
            n += 1;
            return <p key={n}>[{n}] {ref}</p>;
          })}
        </div>
      ))}
    </div>
  );
}

const ACCORDIONS = [
  { title: "How to cite", content: <HowToCiteContent /> },
  { title: "About Automated Wannierisation", content: <AboutContent /> },
  { title: "Acknowledgements", content: <AcknowledgementsContent /> },
];

/** The information accordions at the top of the dashboard, one open at a time. */
export default function InfoAccordions() {
  const [open, setOpen] = useState(null);
  return ACCORDIONS.map(({ title, content }, i) => (
    <McInfoAccordion key={title} title={title} open={open === i} onToggle={() => setOpen(open === i ? null : i)}>
      {content}
    </McInfoAccordion>
  ));
}
