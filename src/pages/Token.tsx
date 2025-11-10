import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Rocket, Users, Shield, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Token = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-semibold">Launching Soon</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            $ABSCHAINAI Token
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            The Official Memecoin of AbstractchainAI
          </p>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join the future of AI and blockchain technology with $ABSCHAINAI, launching soon on the Abstract blockchain. Be part of the community revolutionizing how AI projects connect and grow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-gray-800">
              <CardHeader className="text-center">
                <Coins className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Abstract Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  Built on the cutting-edge Abstract blockchain for lightning-fast transactions and minimal fees.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  A true memecoin powered by the AbstractchainAI community and ecosystem participants.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Fair Launch</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  No pre-sale, no team allocation. A fair launch for everyone in the community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Growth Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  Designed to grow with the AbstractchainAI platform and its expanding project ecosystem.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader className="text-center">
                <Rocket className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Meme Power</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  Combining the viral nature of memecoins with real utility in the AI innovation space.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  Stay tuned for the official launch announcement and trading details.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What is $ABSCHAINAI Section */}
        <div className="max-w-4xl mx-auto px-4 mb-16">
          <Card className="bg-gradient-to-br from-card/50 to-card/30 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">
                What is $ABSCHAINAI?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>
                $ABSCHAINAI is the official memecoin of the AbstractchainAI platform, designed to unite the community around AI innovation and blockchain technology. As a memecoin on the Abstract blockchain, it represents the fun, viral, and community-driven side of our ecosystem.
              </p>
              <p>
                While $ABSCHAINAI started as a memecoin, it serves as a symbol of participation in the AbstractchainAI community. Token holders become part of a movement connecting AI developers, blockchain enthusiasts, and visionaries building the future.
              </p>
              <p>
                The token will launch soon on the Abstract blockchain, featuring a fair distribution model that ensures equal opportunity for all community members to participate from day one.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tokenomics Section */}
        <div className="max-w-4xl mx-auto px-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            Tokenomics
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Total Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary mb-2">1,000,000,000</p>
                <CardDescription className="text-gray-400">
                  One billion tokens for the entire community
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary mb-2">100% Fair</p>
                <CardDescription className="text-gray-400">
                  No team allocation, no pre-sale, community first
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary-hover/10 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join the Movement?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Stay connected with the AbstractchainAI community for launch updates and be among the first to get $ABSCHAINAI when it goes live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary-hover text-black font-semibold px-8 py-6 text-lg"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => navigate('/explore')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-black font-semibold px-8 py-6 text-lg"
              >
                Explore Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Token;
