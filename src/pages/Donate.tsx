import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CRYPTO_ADDRESSES = [
  {
    name: "Bitcoin (BTC)",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Network"
  },
  {
    name: "Ethereum (ETH)",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    network: "Ethereum Network"
  },
  {
    name: "Solana (SOL)",
    address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH",
    network: "Solana Network"
  }
];

const Donate = () => {
  const { toast } = useToast();

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
                  <code className="flex-1 bg-secondary p-3 rounded text-sm break-all">
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