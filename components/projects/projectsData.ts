export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  roi: string;
  problem: string;
  solution: string;
  results: string[];
  codeSnippet: {
    language: string;
    label: string;
    code: string;
  };
}

export const projects: Project[] = [
  {
    id: "thibault",
    index: "01",
    title: "Thibault Household Management",
    subtitle: "Full-Stack PWA",
    description:
      "Full PWA for managing household operations, calendar sync, shopping lists, and task management",
    tech: ["Firebase", "React", "PWA", "GitHub Actions"],
    roi: "Eliminated 15 hours/week of coordination overhead",
    problem:
      "A busy household was losing 15+ hours per week to uncoordinated scheduling, forgotten shopping items, and duplicated task efforts across family members.",
    solution:
      "Built a Progressive Web App with real-time Firebase sync, shared calendar integration, collaborative shopping lists with smart categorization, and a task management system with assignment and completion tracking. Deployed via GitHub Actions CI/CD pipeline.",
    results: [
      "15 hours/week coordination overhead eliminated",
      "100% task visibility across all household members",
      "Zero missed appointments since deployment",
      "Offline-capable via service worker caching",
    ],
    codeSnippet: {
      language: "typescript",
      label: "Real-time sync hook",
      code: `// useRealtimeSync.ts
const useRealtimeSync = <T>(path: string) => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<
    "connecting" | "synced" | "offline"
  >("connecting");

  useEffect(() => {
    const ref = doc(db, path);
    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.data() as T);
      setStatus("synced");
    }, () => setStatus("offline"));

    return () => unsub();
  }, [path]);

  return { data, status };
};`,
    },
  },
  {
    id: "pss",
    index: "02",
    title: "PSS Screen Printing Automation",
    subtitle: "Workflow Automation",
    description:
      "Automated job tracking, invoice generation, and workflow management",
    tech: ["React", "Firebase", "Automated Workflows"],
    roi: "Reduced administrative time by 80%",
    problem:
      "A screen printing business was spending 80% of administrative time on manual job tracking, handwritten invoices, and disorganized workflow management, leading to missed deadlines and billing errors.",
    solution:
      "Developed an automated system that tracks jobs from intake to delivery, generates professional invoices automatically based on job parameters, and provides a visual workflow board. Automated email notifications keep clients informed at every stage.",
    results: [
      "80% reduction in administrative time",
      "Zero billing errors since launch",
      "Average job turnaround reduced by 2 days",
      "Client satisfaction score increased to 4.9/5",
    ],
    codeSnippet: {
      language: "typescript",
      label: "Automated invoice pipeline",
      code: `// invoicePipeline.ts
const generateInvoice = async (jobId: string) => {
  const job = await getJob(jobId);
  const lineItems = calculateLineItems(job);

  const invoice = {
    id: \`INV-\${Date.now()}\`,
    jobRef: job.id,
    client: job.client,
    items: lineItems,
    total: lineItems.reduce(
      (sum, item) => sum + item.qty * item.rate, 0
    ),
    status: "generated",
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "invoices", invoice.id), invoice);
  await notifyClient(job.client.email, invoice);

  return invoice;
};`,
    },
  },
  {
    id: "suithire",
    index: "03",
    title: "Suit Hire Management System",
    subtitle: "Multi-Location Booking",
    description:
      "Multi-location booking system with real-time inventory tracking",
    tech: ["Firebase Real-Time Sync", "React"],
    roi: "Zero double-bookings since launch",
    problem:
      "A multi-location suit hire business was plagued by double-bookings, lost inventory, and manual spreadsheet tracking across locations, resulting in frustrated customers and lost revenue.",
    solution:
      "Built a real-time booking system with Firebase that synchronizes inventory across all locations instantly. The system prevents double-bookings at the database level with transactional writes and provides a unified dashboard for stock management, booking timelines, and return tracking.",
    results: [
      "Zero double-bookings since launch",
      "Real-time inventory accuracy across all locations",
      "30% increase in booking capacity utilization",
      "Return tracking reduced lost items by 95%",
    ],
    codeSnippet: {
      language: "typescript",
      label: "Atomic booking transaction",
      code: `// bookingTransaction.ts
const bookSuit = async (
  suitId: string,
  booking: BookingRequest
) => {
  return runTransaction(db, async (txn) => {
    const suitRef = doc(db, "inventory", suitId);
    const suit = await txn.get(suitRef);

    if (!suit.exists()) throw new Error("NOT_FOUND");
    if (suit.data().status !== "available")
      throw new Error("UNAVAILABLE");

    // Atomic: mark unavailable + create booking
    txn.update(suitRef, {
      status: "reserved",
      currentBooking: booking.id,
    });
    txn.set(doc(db, "bookings", booking.id), {
      ...booking,
      suitId,
      confirmedAt: serverTimestamp(),
    });
  });
};`,
    },
  },
];
