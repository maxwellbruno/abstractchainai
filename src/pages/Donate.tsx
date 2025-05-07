import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const CRYPTO_ADDRESSES = [
  {
    name: "EVM Address (ETH, BNB, etc)",
    address: "0x7fFA58d9E54961d9261bBc559493155219C6a19b",
    network: "EVM Compatible Networks"
  },
  {
    name: "Bitcoin (BTC)",
    address: "bc1p8jxayu6073ll3g5naj7nwnakjhtlv3yw7gw29e8re2he4yp3fafq9w0hw9",
    network: "Bitcoin Taproot"
  },
  {
    name: "Bitcoin Lightning",
    address: "wastecub46@walletofsatoshi.com",
    network: "Lightning Network"
  },
  {
    name: "Solana (SOL)",
    address: "nj5q2g28toopv1aVrKDQC8P32xYyNcZDLHdwDYhGGBq",
    network: "Solana Network"
  },
  {
    name: "Tron (TRX)",
    address: "TJehLJnJKG3Ss5Z6kZqrf4dbvqZmtRvcF7",
    network: "Tron Network"
  }
];

const Donate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied!",
      description: "The crypto address has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-center mb-8">Support Our Project</h1>
          <p className="text-gray-400 text-center mb-12">
            Your support helps us maintain and improve the platform. You can contribute using any of the following cryptocurrencies.
          </p>
          <div className="space-y-6">
            {CRYPTO_ADDRESSES.map((crypto) => (
              <div key={crypto.name} className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{crypto.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{crypto.network}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black p-3 rounded text-sm break-all">
                    {crypto.address}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(crypto.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donate;