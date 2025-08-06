import Footer from "@/components/ui/footer";
import GlassmorphNavbar from "@/components/ui/glassMorphNavigation";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted font-sans">
        <main className="pt-30 sm:pt-40 p-8 pb-20 sm:p-20">
          <GlassmorphNavbar />
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
