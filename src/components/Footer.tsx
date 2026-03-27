import { Leaf, Heart, Phone, Globe, Flag } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t mt-auto">
    {/* Emergency banner */}
    <div className="bg-destructive/10 border-b border-destructive/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-2 text-sm">
        <Phone className="w-4 h-4 text-destructive" />
        <span className="text-destructive font-medium">
          In crisis? Call or text <strong>988</strong> (Suicide & Crisis Lifeline) — available 24/7
        </span>
      </div>
    </div>

    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">MindCheck</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A safe space for university students to check in with their mental wellbeing. Not a diagnostic tool — just a gentle companion.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/self-check" className="block text-muted-foreground hover:text-foreground transition-colors">Self-Check</Link>
            <Link to="/journal" className="block text-muted-foreground hover:text-foreground transition-colors">Journal</Link>
            <Link to="/goals" className="block text-muted-foreground hover:text-foreground transition-colors">Goals & Habits</Link>
            <Link to="/resources" className="block text-muted-foreground hover:text-foreground transition-colors">Resources</Link>
            <Link to="/dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Support Hotlines</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5"><Flag className="w-3.5 h-3.5 text-primary shrink-0" /> 988 Suicide & Crisis Lifeline</p>
            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary shrink-0" /> Crisis Text Line: Text HOME to 741741</p>
            <p className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-primary shrink-0" /> International Association for Suicide Prevention: <a href="https://www.iasp.info/resources/Crisis_Centres/" className="text-primary hover:underline" target="_blank" rel="noopener">Find Help</a></p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        Made with <Heart className="w-3 h-3 text-destructive" /> for student wellbeing © {new Date().getFullYear()} MindCheck
      </div>
    </div>
  </footer>
);

export default Footer;
