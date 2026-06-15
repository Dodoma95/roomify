import {LandingNav} from "@/components/landing/LandingNav";
import {HeroSection} from "@/components/landing/HeroSection";
import {StatsSection} from "@/components/landing/StatsSection";
import {CategoryStrip} from "@/components/landing/CategoryStrip";
import {FeaturedPlaces} from "@/components/landing/FeaturedPlaces";
import {TrustSection} from "@/components/landing/TrustSection";
import {HostCTASection} from "@/components/landing/HostCTASection";
import {LandingFooter} from "@/components/landing/LandingFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#1a1a1a]">
            <LandingNav/>
            <HeroSection/>
            <StatsSection/>
            <CategoryStrip/>
            <FeaturedPlaces/>
            <TrustSection/>
            <HostCTASection/>
            <LandingFooter/>
        </div>
    );
}
