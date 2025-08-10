export const GAME_LEVELS = [
  {
    id: 1,
    title: "Neuroanatomical Foundations",
    subtitle: "Master Surgical Anatomy of the CNS",
    difficulty: "Resident",
    locked: false,
    completed: false,
    description: "Navigate through the fundamental neuroanatomical structures essential for neurosurgical practice. Master cranial anatomy, ventricular system, and vascular territories critical for surgical planning.",
    objectives: [
      "Identify surgical landmarks and anatomical planes",
      "Master cranial base anatomy and foramina",
      "Understand CSF circulation and hydrocephalus pathophysiology",
      "Learn arterial territories and watershed zones"
    ],
    boss: "Hydrocephalus Crisis",
    xp: 150,
    estimatedTime: "60 min",
    surgicalFocus: "Cranial base approaches, ventricular anatomy"
  },
  {
    id: 2,
    title: "Spinal Neurosurgeon",
    subtitle: "Master Vertebral Column & Spinal Cord",
    difficulty: "Resident",
    locked: false,
    completed: false,
    description: "Perform complex spinal procedures while mastering spinal cord anatomy, nerve root pathways, and surgical approaches. Handle spinal trauma, degenerative disease, and tumor resections.",
    objectives: [
      "Execute posterior and anterior cervical approaches",
      "Master thoracolumbar instrumentation techniques",
      "Understand spinal cord tracts and clinical correlations",
      "Perform microsurgical decompression procedures"
    ],
    boss: "Cervical Myelopathy Syndrome",
    xp: 200,
    estimatedTime: "90 min",
    surgicalFocus: "Laminectomy, discectomy, fusion techniques"
  },
  {
    id: 3,
    title: "Cranial Anatomy Explorer",
    subtitle: "Master the Bones of the Skull",
    difficulty: "Medical Student",
    locked: false,
    completed: false,
    description: "An introductory level focused on identifying the major bones of the human skull. A prerequisite for more advanced cranial surgery simulations.",
    objectives: [
      "Identify the Frontal bone",
      "Identify the Parietal bone",
      "Identify the Temporal bone",
      "Identify the Occipital bone",
      "Identify the Mandible"
    ],
    boss: "Anatomy Practical Exam",
    xp: 100,
    estimatedTime: "30 min",
    surgicalFocus: "Anatomical Identification"
  },
  {
    id: 4,
    title: "Spinal Cord Investigator",
    subtitle: "Explore the Spinal Cord Cross-Section",
    difficulty: "Medical Student",
    locked: false,
    completed: false,
    description: "A foundational level for understanding the intricate cross-sectional anatomy of the spinal cord, including gray and white matter.",
    objectives: [
      "Distinguish between gray and white matter",
      "Identify the dorsal and ventral horns",
      "Locate the central canal"
    ],
    boss: "Cross-Sectional Identification Challenge",
    xp: 100,
    estimatedTime: "30 min",
    surgicalFocus: "Anatomical Identification"
  },
  {
    id: 5,
    title: "Brainstem Microsurgery",
    subtitle: "Navigate the Surgical Danger Zone",
    difficulty: "Chief Resident",
    locked: false,
    completed: false,
    description: "Master the most challenging area of neurosurgery. Perform brainstem procedures while preserving vital functions. Navigate cranial nerve complexes and handle brainstem pathology.",
    objectives: [
      "Master cranial nerve surgical anatomy (III-XII)",
      "Perform retrosigmoid and pterional approaches",
      "Handle brainstem gliomas and cavernomas",
      "Execute microvascular decompression procedures"
    ],
    boss: "Acoustic Neuroma Complex",
    xp: 300,
    estimatedTime: "120 min",
    surgicalFocus: "Skull base surgery, cranial nerve preservation"
  },
  {
    id: 6,
    title: "Cerebellar Surgery Specialist",
    subtitle: "Master Posterior Fossa Procedures",
    difficulty: "Chief Resident",
    locked: false,
    completed: false,
    description: "Navigate the posterior fossa with precision. Master cerebellar anatomy, handle Chiari malformations, and perform complex tumor resections while preserving motor function.",
    objectives: [
      "Execute suboccipital craniotomy techniques",
      "Master cerebellar peduncle anatomy",
      "Handle Chiari I & II malformations surgically",
      "Perform cerebellar tumor resections"
    ],
    boss: "Chiari Malformation Crisis",
    xp: 350,
    estimatedTime: "105 min",
    surgicalFocus: "Posterior fossa decompression, tumor resection"
  },
  {
    id: 7,
    title: "Deep Brain Surgery",
    subtitle: "Master Subcortical Procedures",
    difficulty: "Fellow",
    locked: false,
    completed: false,
    description: "Perform stereotactic procedures and deep brain stimulation. Navigate thalamic nuclei, handle movement disorders, and master functional neurosurgery techniques.",
    objectives: [
      "Master stereotactic frame placement and targeting",
      "Perform DBS electrode implantation",
      "Handle thalamic and hypothalamic lesions",
      "Execute functional disconnection procedures"
    ],
    boss: "Parkinson's Tremor Storm",
    xp: 400,
    estimatedTime: "135 min",
    surgicalFocus: "Stereotactic surgery, DBS, functional procedures"
  },
  {
    id: 8,
    title: "Cerebral Cortex Mastery",
    subtitle: "Advanced Cortical Resections",
    difficulty: "Fellow",
    locked: false,
    completed: false,
    description: "Master awake craniotomy techniques and eloquent area surgery. Perform temporal lobectomy, hemispherectomy, and complex epilepsy procedures while preserving function.",
    objectives: [
      "Execute awake craniotomy with cortical mapping",
      "Master temporal lobe anatomy and amygdalohippocampectomy",
      "Perform functional cortical resections",
      "Handle arteriovenous malformation resections"
    ],
    boss: "Eloquent Area Glioblastoma",
    xp: 500,
    estimatedTime: "150 min",
    surgicalFocus: "Awake surgery, cortical mapping, epilepsy surgery"
  },
  {
    id: 9,
    title: "Vascular Neurosurgery",
    subtitle: "Master Cerebrovascular Procedures",
    difficulty: "Attending",
    locked: false,
    completed: false,
    description: "Handle complex aneurysms, AVMs, and stroke interventions. Master microsurgical clipping, bypass procedures, and endovascular techniques.",
    objectives: [
      "Perform aneurysm clipping via multiple approaches",
      "Execute EC-IC bypass procedures",
      "Handle arteriovenous malformation resections",
      "Master carotid endarterectomy techniques"
    ],
    boss: "Ruptured Giant Aneurysm",
    xp: 600,
    estimatedTime: "180 min",
    surgicalFocus: "Aneurysm surgery, bypass, AVM resection"
  },
  {
    id: 10,
    title: "Neuro-Oncology Specialist",
    subtitle: "Master Complex Tumor Surgery",
    difficulty: "Attending",
    locked: false,
    completed: false,
    description: "Perform complex brain tumor resections using advanced techniques. Handle glioblastomas, meningiomas, and skull base tumors with maximal safe resection principles.",
    objectives: [
      "Execute gross total resection of high-grade gliomas",
      "Perform skull base meningioma resections",
      "Master intraoperative neuromonitoring",
      "Handle pediatric brain tumor complexities"
    ],
    boss: "Glioblastoma Multiforme",
    xp: 700,
    estimatedTime: "200 min",
    surgicalFocus: "Tumor resection, skull base surgery, pediatric cases"
  },
  {
    id: 11,
    title: "Trauma Neurosurgery",
    subtitle: "Emergency Neurosurgical Procedures",
    difficulty: "Expert",
    locked: false,
    completed: false,
    description: "Handle neurosurgical emergencies and complex trauma cases. Master ICP management, perform emergency craniotomies, and handle polytrauma scenarios.",
    objectives: [
      "Execute emergency decompressive craniotomy",
      "Master ICP monitoring and management",
      "Handle penetrating brain injury cases",
      "Perform emergency spine stabilization"
    ],
    boss: "Polytrauma with Raised ICP",
    xp: 800,
    estimatedTime: "240 min",
    surgicalFocus: "Emergency procedures, ICP management, trauma"
  },
  {
    id: 12,
    title: "Neurosurgical Scion",
    subtitle: "Master of All Neurosurgical Arts",
    difficulty: "Master Surgeon",
    locked: false,
    completed: false,
    description: "The ultimate test combining all neurosurgical subspecialties. Handle the most complex cases requiring mastery of all previous levels. Demonstrate complete neurosurgical expertise.",
    objectives: [
      "Perform combined approaches for complex pathology",
      "Master all neurosurgical subspecialties",
      "Handle rare and complex case presentations",
      "Demonstrate teaching and leadership skills"
    ],
    boss: "The Ultimate Neurosurgical Challenge",
    xp: 1000,
    estimatedTime: "300 min",
    surgicalFocus: "Multi-specialty mastery, complex cases, innovation"
  }
];
