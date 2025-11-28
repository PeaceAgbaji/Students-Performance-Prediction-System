import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Award, AlertCircle } from "lucide-react";

interface PredictionResult {
  category: string;
  predicted_score: number;
  detail: string;
}

const Results = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('predictionResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      navigate('/predict');
    }
  }, [navigate]);

  if (!result) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'excellent':
        return 'from-secondary to-accent';
      case 'good':
        return 'from-primary to-secondary';
      case 'satisfactory':
        return 'from-accent to-primary';
      default:
        return 'from-muted to-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'excellent':
        return <Award className="w-12 h-12" />;
      case 'good':
        return <TrendingUp className="w-12 h-12" />;
      default:
        return <AlertCircle className="w-12 h-12" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Category Card */}
          <Card className={`p-8 text-center bg-gradient-to-br ${getCategoryColor(result.category)} text-white shadow-strong`}>
            <div className="flex justify-center mb-4">
              {getCategoryIcon(result.category)}
            </div>
            <h2 className="text-sm font-medium uppercase tracking-wider opacity-90 mb-2">
              Performance Category
            </h2>
            <h1 id="result-category" className="text-5xl font-bold mb-2">
              {result.category}
            </h1>
            <p className="text-lg opacity-90">
              Based on comprehensive analysis
            </p>
          </Card>

          {/* Score Card */}
          <Card className="p-8 shadow-strong">
            <div className="text-center">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Predicted Final Score
              </h3>
              <div id="result-score" className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {result.predicted_score.toFixed(2)}/20
              </div>
              <div className="w-full bg-muted rounded-full h-4 mt-4">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(result.predicted_score / 20) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <Card className="p-8 shadow-strong">
            <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
            <div 
              id="result-detail" 
              className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
            >
              {result.detail}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/predict')}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
            >
              New Prediction
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
