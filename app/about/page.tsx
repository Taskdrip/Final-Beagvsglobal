import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, Globe, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Beagvs</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Beagvs is a revolutionary marketplace platform that combines the power of Pi Network cryptocurrency with secure escrow protection and integrated shipping solutions. We are committed to creating a safe, transparent, and efficient environment for buying and selling goods and services online.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Card>
          <CardContent className="pt-6">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Security First</h3>
            <p className="text-muted-foreground">
              Every transaction is protected by our escrow system, ensuring that payments are only released when both parties are satisfied.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Built by the community, for the community. We listen to feedback and continuously improve our platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Globe className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-muted-foreground">
              Connect with buyers and sellers worldwide, with multiple shipping options and international support.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Zap className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Efficient</h3>
            <p className="text-muted-foreground">
              Quick listing process, instant Pi Network payments, and real-time tracking for all your orders.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To democratize online commerce by providing a secure, transparent, and accessible marketplace that empowers individuals and businesses to transact with confidence using cryptocurrency. We believe in fair trade, buyer and seller protection, and the future of decentralized payments.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To become the world's leading Pi Network-powered marketplace, where millions of users can safely buy, sell, and ship goods and services with the assurance that their transactions are protected, their data is secure, and their experience is seamless.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Why Pi Network?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pi Network represents the future of accessible cryptocurrency. By integrating Pi as our primary payment method, we are making it easier for everyone to participate in the digital economy without the complexity and high fees associated with traditional payment processors. With Pi Network, transactions are fast, secure, and cost-effective.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-muted-foreground leading-relaxed">
            We are committed to maintaining the highest standards of security, transparency, and customer service. Our platform is continuously monitored and updated to ensure that all transactions are safe and that disputes are resolved fairly. We stand behind every transaction on our platform and work tirelessly to protect both buyers and sellers.
          </p>
        </div>
      </div>
    </div>
  );
}
