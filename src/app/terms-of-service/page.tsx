"use client";

import { useState, useEffect } from 'react';
import { client } from "@/sanity/lib/client";
import { LEGAL_PAGE_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    client.fetch(LEGAL_PAGE_QUERY, { id: 'termsOfService' }).then((d) => { if (d) setCms(d); }).catch(() => {});
  }, []);

  return (
    <div className="container py-12">
      <div className="prose mx-auto">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl text-center mb-8">{cms?.title || 'Terms of Service'}</h1>

        {(cms?.lastUpdated || lastUpdated) && <p><em>Last updated: {cms?.lastUpdated || lastUpdated}</em></p>}

        {cms?.content ? (
          <PortableText value={cms.content} />
        ) : (
          <>
        <p>This is a placeholder Terms of Service page. In a real application, this document would form a legal agreement between the service provider and the user.</p>

        <h2 className="text-2xl font-headline mt-8">1. Agreement to Terms</h2>
        <p>By using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the services. This is a demo application and these terms are not legally binding.</p>

        <h2 className="text-2xl font-headline mt-8">2. Use of the Service</h2>
        <p>You must use the Service in compliance with all applicable laws. You are responsible for your conduct while using the Service and for any content you provide, including compliance with applicable laws, rules, and regulations.</p>

        <h2 className="text-2xl font-headline mt-8">3. User Accounts</h2>
        <p>You may need to create an account to use some of our services. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.</p>

        <h2 className="text-2xl font-headline mt-8">4. Termination</h2>
        <p>We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

        <h2 className="text-2xl font-headline mt-8">5. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of changes by posting the new Terms of Service on this page.</p>
        
        <h2 className="text-2xl font-headline mt-8">6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at contact@indojapanhub.com.</p>
          </>
        )}
      </div>
    </div>
  );
}
