
import type {NextConfig} from 'next';


const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  transpilePackages: ['sanity', 'next-sanity'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ijcc.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.asiancommunitynews.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgcp.aacdn.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.investindia.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'www.aima.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.aranca.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ajujapanesehotels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'veenapower.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ahujaresidences.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nd.jpf.go.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jetro.go.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jica.go.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iccr.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.indembassy-tokyo.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.indconosaka.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'haryana.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnbbsr.s3waas.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.seeklogo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'up.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jccii.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.osaka.cci.or.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'necouncil.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'abhimanuias.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'icea.org.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.seaj.or.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pngguru.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.obda.or.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'timestech.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'enpointeadwisers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aamidainfotech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'www.blsinternational.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.harkesh.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sumankhaitanco.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/resources/self_study',
        destination: '/resources/self-study',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  }
};

export default nextConfig;
