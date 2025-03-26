import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-mono font-bold mb-6">Privacy & Security</h1>
        <div className="space-y-6 font-mono">
          <section>
            <h2 className="text-xl font-bold mb-3">Data Collection</h2>
            <p className="text-muted-foreground">
              SHOJO LABS Research Lab & Community is committed to protecting your privacy. We collect minimal data
              necessary for the functioning of our services. All data is encrypted and stored securely.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3">AI Analytics</h2>
            <p className="text-muted-foreground">
              Our AI analytics system processes blockchain and social media data to provide insights. This data is
              anonymized and aggregated. No personal information is stored or shared with third parties.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3">Cookies & Local Storage</h2>
            <p className="text-muted-foreground">
              We use cookies and local storage to enhance your experience. These are used to remember your preferences,
              such as dark/light mode settings.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We integrate with blockchain networks and social media platforms to provide our services. Please refer to
              their respective privacy policies for information on how they handle your data.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              For any privacy concerns or questions, please contact us through our official channels listed on the main
              page.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}

