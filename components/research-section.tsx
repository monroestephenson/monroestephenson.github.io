"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "@/components/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function ResearchSection() {
  const researchItems = [
    {
      title: "Cumulant Tensors in Partitioned Independent Component Analysis",
      period: "2023-2024",
      institution: "Max Planck Institute for Mathematics in the Sciences (MPI MiS)",
      supervisor: "Bernd Sturmfels",
      fundingInfo: "Fulbright Research Grant",
      description:
        "My research focused on algebraic machine learning and statistical theory, particularly on non-independent component analysis and graphical models. This work led to the publication of Partitioned Independent Component Analysis, which is available on arXiv.",
      link: "https://arxiv.org/abs/2402.10089",
      institutionLink: "https://www.mis.mpg.de",
      supervisorLink: "https://math.berkeley.edu/~bernd/",
      tags: ["Algebraic Machine Learning", "Statistical Theory", "Component Analysis"],
    },
    {
      title: "p-anisotropy on the moment curve for homology manifolds and cycles",
      period: "Summer 2022",
      institution: "Hebrew University",
      supervisor: "Karim Adiprasito",
      description:
        "We prove that the Gorensteinification of the face ring of a cycle is totally p-anisotropic in characteristic p. In other words, given an appropriate Artinian reduction, it contains no nonzero p-isotropic elements. Moreover, we prove that the linear system of parameters can be chosen corresponding to a geometric realization with points on the moment curve. In particular, this implies that the parameters do not have to be chosen very generically.",
      link: "https://www.arxiv.org/abs/2502.05681",
      institutionLink: "#",
      supervisorLink: "https://webusers.imj-prg.fr/%7Ekarim.adiprasito/",
      fundingInfo: "Karim's ERC Consolidator grant",
      fundingLink:
        "https://mathematics.huji.ac.il/news/congratulations-prof-karim-adiprasito-winning-erc-consolidator-grant",
      tags: ["Simplicial Complexes", "Moment Curve", "g-conjecture", "Hopf Conjecture"],
    },
    {
      title: "Differential Power Operation on Ideals",
      period: "Summer 2021",
      institution: "University of Michigan",
      supervisor: "Jennifer Kenkel, Janet Page, and Daniel Smolkin",
      description:
        "Our research focused on the differential power operation on ideals. We identified a class of monomial ideals in characteristic 0 whose differential powers are eventually principal. We also explored the containment problem between ordinary and differential powers of ideals and introduced a novel closure operation, called differential closure, which agrees with taking the radical of an ideal in simple D-modules.",
      link: "http://arxiv.org/abs/2111.15653",
      institutionLink: "#",
      supervisorLinks: [
        { name: "Jennifer Kenkel", url: "https://www.jennykenkel.coffee" },
        { name: "Janet Page", url: "http://www-personal.umich.edu/~jrpage/index.html" },
        { name: "Daniel Smolkin", url: "https://lsa.umich.edu/math/people/postdoc-faculty/smolkind.html" },
      ],
      fundingInfo: "Karen Smith's NSF grant DMS-1801697",
      fundingLink: "http://www.math.lsa.umich.edu/~kesmith/",
      tags: ["Differential Powers", "Monomial Ideals", "D-modules", "Closure Operations"],
    },
    {
      title: "Abelian Sandpile Model for DDoS Mitigation",
      period: "Summer 2020",
      institution: "Portland State University",
      supervisor: "Christof Teuscher",
      description:
        "I collaborated with Art Duval from UTEP on applying the Abelian Sandpile Model to DDoS mitigation. This project led to an ongoing publication titled, 'Analyzing Network Topology for DDoS Mitigation Using the Abelian Sandpile Model.'",
      link: "http://people.reed.edu/%7Emostephen/hw%20/ASM_SIAM.pdf",
      institutionLink: "#",
      supervisorLink: "https://www.teuscher-lab.com",
      collaboratorInfo: "Art Duval from UTEP",
      collaboratorLink: "http://www.math.utep.edu/Faculty/duval/home.html",
      additionalInfo: "Created as a response to the COVID-19 pandemic",
      tags: ["Abelian Sandpile Model", "DDoS Mitigation", "Network Topology"],
    },
    {
      title: "LDMX Project in Experimental High-Energy Particle Physics",
      period: "Summer 2019",
      institution: "Texas Tech University",
      supervisor: "Andrew Whitbeck",
      description:
        "I worked in the Experimental High-Energy Particle department, contributing to the LDMX project. My work included SketchUp design, data collection from oscilloscopes, scintillators, and PMTs, and data analysis using Python. The project also involved designing and modifying electrical circuits.",
      link: "http://people.reed.edu/%7Emostephen/hw%20/A_Brief_Summary_of_Research_Preformed_at_APD_in_the_Summer_of_2019.pdf",
      institutionLink: "#",
      tags: ["High-Energy Particle Physics", "LDMX", "Data Analysis", "Circuit Design"],
    },
  ]

  return (
    <div>
      <SectionHeader
        title="Research"
        subtitle="Academic research exploring algebraic machine learning, statistical theory, and mathematical foundations."
      />

      <div className="space-y-8">
        {researchItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-stone-200 dark:border-zinc-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-stone-100 dark:bg-zinc-800/50">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <Badge
                    variant="outline"
                    className="border-amber-700 text-amber-700 dark:border-amber-500 dark:text-amber-500"
                  >
                    {item.period}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.institutionLink ? (
                      <Link
                        href={item.institutionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-700 dark:hover:text-amber-500"
                      >
                        {item.institution}
                      </Link>
                    ) : (
                      item.institution
                    )}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Supervisor:{" "}
                    {item.supervisorLinks ? (
                      item.supervisorLinks.map((supervisor, i) => (
                        <span key={i}>
                          <Link
                            href={supervisor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-700 dark:hover:text-amber-500"
                          >
                            {supervisor.name}
                          </Link>
                          {i < item.supervisorLinks.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : item.supervisorLink ? (
                      <Link
                        href={item.supervisorLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-700 dark:hover:text-amber-500"
                      >
                        {item.supervisor}
                      </Link>
                    ) : (
                      item.supervisor
                    )}
                  </p>
                  {item.fundingInfo && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {item.fundingLink ? (
                        <>
                          Funded by{" "}
                          <Link
                            href={item.fundingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-700 dark:hover:text-amber-500"
                          >
                            {item.fundingInfo}
                          </Link>
                        </>
                      ) : (
                        <>Funded by {item.fundingInfo}</>
                      )}
                    </p>
                  )}
                  {item.collaboratorInfo && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      Collaborated with{" "}
                      {item.collaboratorLink ? (
                        <Link
                          href={item.collaboratorLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-amber-700 dark:hover:text-amber-500"
                        >
                          {item.collaboratorInfo}
                        </Link>
                      ) : (
                        item.collaboratorInfo
                      )}
                    </p>
                  )}
                  {item.additionalInfo && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{item.additionalInfo}</p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <p>{item.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {item.link && (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-amber-700 dark:text-amber-500 hover:underline mt-2"
                  >
                    View Publication <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

