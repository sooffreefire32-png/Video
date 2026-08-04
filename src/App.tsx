import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { Story } from "./components/Story";
import { Teaser } from "./components/Teaser";
import { Timeline } from "./components/Timeline";
import { Characters } from "./components/Characters";
import { Workflow } from "./components/Workflow";
import { FileKit } from "./components/FileKit";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Story />
        <Teaser />
        <Timeline />
        <Characters />
        <Workflow />
        <FileKit />
      </main>
      <Footer />
    </div>
  );
}
