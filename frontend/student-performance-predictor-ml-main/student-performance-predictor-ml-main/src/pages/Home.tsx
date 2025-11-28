import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, TrendingUp, BarChart3 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 shadow-strong">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Student Performance Predictor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered analytics to predict and improve student academic outcomes
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Card className="p-6 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Accurate Predictions</h3>
            <p className="text-muted-foreground text-sm">
              Machine learning models trained on comprehensive student data for reliable forecasts
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-muted-foreground text-sm">
              Comprehensive breakdown of factors influencing academic performance
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
            <p className="text-muted-foreground text-sm">
              Personalized recommendations to help students reach their full potential
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-card to-muted/30 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <h2 className="text-3xl font-bold mb-4">Ready to Predict Performance?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Enter student information to receive an AI-powered performance prediction with detailed insights
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/predict')}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 shadow-strong hover:shadow-xl text-lg px-8 py-6 h-auto"
          >
            Start Prediction
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Home;
