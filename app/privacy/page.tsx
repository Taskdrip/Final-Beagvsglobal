export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
          <p className="leading-relaxed mb-4">
            We collect information you provide directly to us when you create an account, list items, make purchases, or contact us. This includes your Pi Network user ID, username, email address, and transaction history.
          </p>
          <p className="leading-relaxed">
            We also collect information automatically through your use of the platform, including device information, IP address, and usage patterns to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
          <p className="leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our marketplace services</li>
            <li>Process transactions and manage escrow payments</li>
            <li>Send you transaction notifications and service updates</li>
            <li>Respond to your requests and provide customer support</li>
            <li>Detect and prevent fraud and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
          <p className="leading-relaxed mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Other users as necessary to complete transactions</li>
            <li>Service providers who assist in our operations</li>
            <li>Pi Network for payment processing</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Pi Network Integration</h2>
          <p className="leading-relaxed">
            Our platform integrates with Pi Network for payment processing. When you make a payment, we share necessary transaction information with Pi Network in accordance with their privacy policy. Your Pi wallet information is encrypted and securely handled.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
          <p className="leading-relaxed">
            We implement industry-standard security measures to protect your information. All payment transactions are encrypted and processed through secure escrow. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
          <p className="leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and review your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
          <p className="leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to Privacy Policy</h2>
          <p className="leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions about this privacy policy or our data practices, please contact us at privacy@beagvs.com.
          </p>
        </section>

        <div className="pt-8 border-t">
          <p className="text-sm">Last Updated: January 2024</p>
        </div>
      </div>
    </div>
  );
}
