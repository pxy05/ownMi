import Footer from "@/components/ui/footer";
import GlassmorphNavbar from "@/components/ui/glassMorphNavigation";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <GlassmorphNavbar />
      {children}
      <Footer />
    </main>
  );
}
