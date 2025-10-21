
import React, { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ChecklistIcon, ShieldIcon, MicrophoneIcon } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { PricingCard } from '@/components/ui/pricing-card';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Input } from '@/components/ui/input';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { motion, AnimatePresence } from 'framer-motion';


type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <ChecklistIcon />,
    title: "Repeatable Checklists",
    description: "Generate a fresh onboarding checklist for every new guest in one click."
  },
  {
    icon: <ShieldIcon />,
    title: "Never Miss a Step",
    description: "Ensure you have the bio, headshot, release form, and talking points before you hit record."
  },
  {
    icon: <MicrophoneIcon />,
    title: "Focus on the Conversation",
    description: "Stop worrying about logistics and start having better interviews that impress potential clients."
  }
];

const HoverEffect = ({ items, className }: {
  items: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 -m-4", className)}>
      {items.map((item, idx) => (
        <div
          key={item.title}
          className="relative group block p-4 h-full w-full"
        >
          <GlowCard customSize={true} className="h-full" glowColor="purple">
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-12 w-12 mx-auto bg-primary rounded-full text-primary-foreground group-hover:animate-subtle-bounce">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-gray-300">{item.description}</p>
            </div>
          </GlowCard>
        </div>
      ))}
    </div>
  );
};

const FeaturesSection: React.FC = () => (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          A Simple Process for Every Guest
        </h3>
        <HoverEffect items={features} />
      </div>
    </section>
  );

const PricingSection = ({ onCTAClick }: { onCTAClick: () => void; }) => (
    <PricingCard
      title="Lifetime Deal"
      description="A special one-time price for our first supporters. Get all future updates, forever."
      price={29}
      originalPrice={79}
      features={[
        {
          title: "Core Features",
          items: [
            "One-Click Guest Checklists",
            "Automated Email Reminders",
            "Secure Release Form Handling",
            "Guest Info Database",
          ],
        },
        {
          title: "Pro Benefits",
          items: [
            "Impress Guests & Clients",
            "Save Hours Every Week",
            "Never Miss a Detail",
            "Focus on Great Content",
          ],
        },
      ]}
      buttonText="Lock In Your Launch Price"
      onButtonClick={onCTAClick}
    />
);


type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const EmailCaptureSection: React.ForwardRefRenderFunction<HTMLDivElement> = (props, ref) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage("You're on the list! We'll be in touch soon.");
        setEmail('');
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please check your connection and try again.');
    }
  };
  
  return (
    <section ref={ref} className="py-20 md:py-32 bg-background text-foreground relative antialiased overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Be the First to Know.</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Enter your email below to get notified the moment we go live.
        </p>
        <div className="max-w-lg mx-auto min-h-[7rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email Address"
                      className="flex-grow h-11 text-base"
                      disabled={status === 'loading'}
                      aria-label="Email Address"
                      aria-invalid={status === 'error'}
                      aria-describedby="email-error"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="font-bold"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Submitting...' : 'Get Notified on Launch'}
                    </Button>
                  </div>
                </form>
                 {status === 'error' && message && (
                  <p id="email-error" className="mt-4 text-sm text-red-500 text-left">
                    {message}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center justify-center p-6 bg-green-500/10 border border-green-500/30 rounded-lg w-full"
              >
                <CheckCircle2 className="h-12 w-12 text-green-400 mb-4" />
                <p className="text-lg font-medium text-green-300">
                  {message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <BackgroundBeams />
    </section>
  );
};

const ForwardedEmailCaptureSection = React.forwardRef(EmailCaptureSection);

const Footer: React.FC = () => (
  <footer className="py-6 bg-background">
    <div className="container mx-auto px-6 text-center text-gray-400">
      &copy; {new Date().getFullYear()} GuestFlow. All Rights Reserved.
    </div>
  </footer>
);


export default function App() {
  const emailFormRef = useRef<HTMLDivElement>(null);

  const handleScrollToForm = () => {
    emailFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background">
      <main>
        <HeroGeometric
          badge="GuestFlow"
          title1="Stop Looking Unprofessional."
          title2="Streamline Guest Onboarding."
          onCTAClick={handleScrollToForm}
        >
          <p className="text-base sm:text-lg md:text-xl text-white/40 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
            Go from chaotic spreadsheets to a repeatable, professional process for every guest. Never forget a bio, headshot, or release form again.
          </p>
          <Button
            onClick={handleScrollToForm}
            size="lg"
            className="font-bold text-lg group"
          >
            Get Notified on Launch
            <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </HeroGeometric>
        <FeaturesSection />
        <PricingSection onCTAClick={handleScrollToForm} />
        <ForwardedEmailCaptureSection ref={emailFormRef} />
      </main>
      <Footer />
    </div>
  );
}