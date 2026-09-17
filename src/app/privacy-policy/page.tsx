"use client";

import { useState, useEffect } from 'react';
import { client } from "@/sanity/lib/client";
import { LEGAL_PAGE_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    client.fetch(LEGAL_PAGE_QUERY, { id: 'privacyPolicy' }).then((d) => { if (d) setCms(d); }).catch(() => {});
  }, []);

  return (
    <div className="container py-12">
      <div className="prose mx-auto">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl text-center mb-8">{cms?.title || 'Privacy Policy'}</h1>
        
        {(cms?.lastUpdated || lastUpdated) && <p><em>Last updated: {cms?.lastUpdated || lastUpdated}</em></p>}
        {cms?.content ? (
          <PortableText value={cms.content} />
        ) : (
          <></>
        )}
        {!cms?.content && (
          <>
        <p>This is a placeholder Privacy Policy page. In a real application, this page would contain detailed information about how user data is collected, used, and protected.</p>
        
        <h2 className="text-2xl font-headline mt-8">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, fill out a form, or otherwise communicate with us. This may include your name, email address, and any other information you choose to provide.</p>
        
        <h2 className="text-2xl font-headline mt-8">2. How We Use Your Information</h2>
        <p>We use the information we collect to operate, maintain, and provide you with the features and functionality of the service, as well as to communicate directly with you, such as to send you email messages.</p>
        
        <h2 className="text-2xl font-headline mt-8">3. Sharing of Your Information</h2>
        <p>We do not share your personal information with third parties except as described in this Privacy Policy. We may share your personal information with vendors and service providers who need access to such information to carry out work on our behalf.</p>
        
        <h2 className="text-2xl font-headline mt-8">4. Your Choices</h2>
        <p>You may update, correct, or delete information about you at any time by logging into your account or contacting us. If you wish to delete or deactivate your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes.</p>

        <h2 className="text-2xl font-headline mt-8">5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at contact@indojapanhub.com.</p>
          </>
        )}
      </div>
    </div>
  );
}
