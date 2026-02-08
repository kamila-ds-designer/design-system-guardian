import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const LOGO_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

function getRoute() {
  const hash = (location.hash.slice(1) || "/").replace(/^\/+|\/+$/g, "")
  const parts = hash ? hash.split("/") : []
  const path = parts[0] || "start"
  return { path, params: parts.slice(1) }
}

function navigate(path: string) {
  location.hash = "#" + (path.startsWith("/") ? path.slice(1) : path)
}

export default function App() {
  const [route, setRoute] = useState(getRoute())
  const [mode, setMode] = useState<"docs" | "qa">("docs")
  const [link, setLink] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("guardian:theme")
      return stored === "dark" ? "dark" : "light"
    } catch {
      return "light"
    }
  })

  useEffect(() => {
    const handler = () => setRoute(getRoute())
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    try {
      localStorage.setItem("guardian:theme", theme)
    } catch {}
  }, [theme])

  const { path, params } = route
  const isConfig = path === "config"
  const isStart = path === "start" || !path
  const isCentered = isConfig || isStart || path === "docs" || path === "docs-loading" || path === "audit-loading"

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
        <a href="#/start" onClick={(e) => { e.preventDefault(); navigate("/start") }} className="flex items-center gap-2 font-semibold text-lg no-underline text-foreground">
          {LOGO_SVG} Guardian
        </a>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/config")}>
            Settings
          </Button>
        </div>
      </header>

      {!isCentered && (
        <div className="flex flex-1">
          <aside className="w-60 bg-zinc-900 border-r border-border p-4 flex flex-col gap-4">
            <Button className="w-full" onClick={() => navigate("/docs")}>New</Button>
            <Button className="w-full" onClick={() => navigate("/qa")}>New Test</Button>
            <div className="text-xs font-medium text-muted-foreground px-3 mb-1">Doc Files</div>
            {["button", "input", "tag", "chips"].map((id) => (
              <a
                key={id}
                href={`#/doc-view/${id}`}
                onClick={(e) => { e.preventDefault(); navigate(`/doc-view/${id}`) }}
                className={`px-3 py-2 rounded-md text-sm ${params[0] === id ? "bg-accent" : ""} hover:bg-accent`}
              >
                &lt;&gt; {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <a href="#/docs" onClick={(e) => { e.preventDefault(); navigate("/docs") }} className="px-3 py-2 rounded-md text-sm hover:bg-accent">
              All generated documents
            </a>
            <div className="text-xs font-medium text-muted-foreground px-3 mb-1">Test Audits</div>
            <a href="#/qa" onClick={(e) => { e.preventDefault(); navigate("/qa") }} className={`px-3 py-2 rounded-md text-sm ${path === "qa" ? "bg-accent" : ""} hover:bg-accent`}>
              QA audit
            </a>
            <div className="text-xs font-medium text-muted-foreground px-3 mb-1">More</div>
            <a href="#/contact" onClick={(e) => { e.preventDefault(); navigate("/contact") }} className={`px-3 py-2 rounded-md text-sm ${path === "contact" ? "bg-accent" : ""} hover:bg-accent`}>
              Contact
            </a>
          </aside>
          <main className="flex-1 p-6 overflow-auto">
            {path === "contact" && <ContactForm />}
            {path === "doc-view" && <DocView componentId={params[0] || "button"} />}
            {path === "qa" && <QAScreen />}
            {path === "audit-results" && <AuditResultsScreen />}
          </main>
        </div>
      )}

      {isCentered && (
        <main className="flex-1 flex items-center justify-center p-8 max-w-2xl mx-auto">
          {path === "docs-loading" && <LoadingScreen title="Analyzing your design" onCancel={() => navigate("/start")} />}
          {path === "audit-loading" && <LoadingScreen title="Analyzing your design" onCancel={() => navigate("/qa")} />}
          {(isStart || path === "docs") && (
            <StartScreen
              mode={path === "docs" ? "docs" : path === "qa" ? "qa" : mode}
              setMode={setMode}
              link={link}
              setLink={setLink}
              onAnalyze={() => {
                setLink(link)
                if (mode === "docs") {
                  navigate("/docs-loading")
                  setTimeout(() => navigate("/doc-view/button"), 2000)
                } else {
                  navigate("/audit-loading")
                  setTimeout(() => navigate("/audit-results"), 3000)
                }
              }}
            />
          )}
        </main>
      )}
    </div>
  )
}

function StartScreen({
  mode,
  setMode,
  link,
  setLink,
  onAnalyze,
}: {
  mode: "docs" | "qa"
  setMode: (m: "docs" | "qa") => void
  link: string
  setLink: (l: string) => void
  onAnalyze: () => void
}) {
  const headline = mode === "docs" ? "What new component do you need doc for?" : "What new UI do you want to test for?"
  const subhead = mode === "docs"
    ? "Generate design system documentation or QA UI screens with contextual fixes."
    : "Paste the design link and DS Guardian will test against your Documentation"

  return (
    <div className="flex flex-col items-center text-center w-full">
      <div className="mb-4">{LOGO_SVG}</div>
      <h1 className="text-2xl font-semibold mb-2">Guardian</h1>
      <Tabs value={mode} onValueChange={(v) => setMode(v as "docs" | "qa")} className="w-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="docs">Docs Generator</TabsTrigger>
          <TabsTrigger value="qa">QA Checker</TabsTrigger>
        </TabsList>
      </Tabs>
      <h2 className="text-xl font-medium mt-6 mb-2">{headline}</h2>
      <p className="text-muted-foreground mb-4">{subhead}</p>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="Paste a Figma component, or GitHub link..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onAnalyze}>Analyze →</Button>
      </div>
    </div>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-1">Contact us</h1>
      <p className="text-muted-foreground mb-6">Send us a message and we'll get back to you as soon as possible.</p>
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your name" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="How can we help?" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message..." rows={4} required className="mt-2" />
          </div>
          <Button type="submit">Send message</Button>
        </form>
      </Card>
      {sent && (
        <Card className="mt-4 border-green-500/50 bg-green-500/10">
          <CardContent className="pt-6">
            <p className="font-medium">Message sent</p>
            <p className="text-sm text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DocView({ componentId }: { componentId: string }) {
  return (
    <div className="max-w-3xl">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Component</span>
      <h1 className="text-2xl font-semibold mt-1">{componentId.charAt(0).toUpperCase() + componentId.slice(1)}</h1>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Component documentation for {componentId}. Use shadcn/ui components for all UI elements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingScreen({ title, onCancel }: { title: string; onCancel: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 text-4xl">...</div>
      <h1 className="text-xl font-semibold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">This may take a few moments while we check your UI against documentation standards</p>
      <div className="space-y-2 w-64 mb-6">
        {["Fetching design file...", "Extracting UI components...", "Running QA checks...", "Generating report..."].map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-md border bg-card text-sm">
            {i < 1 ? "✓" : i === 1 ? "⟳" : "○"} {s}
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={onCancel}>Cancel Analysis</Button>
    </div>
  )
}

function QAScreen() {
  const [link, setLink] = useState("")
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">See a Live Audit</h1>
      <p className="text-muted-foreground mb-6">Upload a team member's design and instantly see where it doesn't match your system.</p>
      <Card>
        <CardHeader>
          <CardTitle>Uploads Designs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qa-link">Add link</Label>
            <Input id="qa-link" placeholder="https://www.figma.com/design/..." value={link} onChange={(e) => setLink(e.target.value)} className="mt-2" />
          </div>
          <Button onClick={() => navigate("/audit-loading")}>Run Audit</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditResultsScreen() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Audit Results</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { value: "7", label: "Violations Found" },
          { value: "3", label: "High Severity" },
          { value: "2", label: "Medium Severity" },
          { value: "2", label: "Low Severity" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Visual Preview</CardTitle>
          <Button>Auto-fix All (7)</Button>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
            Design preview
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
