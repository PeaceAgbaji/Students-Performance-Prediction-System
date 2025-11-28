import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PredictionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 10 Visible Inputs
  const [g1, setG1] = useState(10);
  const [g2, setG2] = useState(10);
  const [studyTime, setStudyTime] = useState(2);
  const [absences, setAbsences] = useState(0);
  const [age, setAge] = useState(17);
  const [motherEd, setMotherEd] = useState(2);
  const [fatherEd, setFatherEd] = useState(2);
  const [internet, setInternet] = useState(true);
  const [higher, setHigher] = useState(true);
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Build the payload with all 41 inputs
    const formData = {
      // 10 Visible inputs
      grade_period1: g1,
      grade_period2: g2,
      study_time: studyTime,
      absences: absences,
      age: age,
      mother_education: motherEd,
      father_education: fatherEd,
      internet: internet ? 1 : 0,
      higher: higher ? 1 : 0,
      paid: paid ? 1 : 0,
      
      // 31 Hidden inputs (all set to 0)
      gender: 0,
      home_location: 0,
      family_size: 0,
      parent_status: 0,
      travel_time: 0,
      past_failures: 0,
      schoolsup: 0,
      famsup: 0,
      activities: 0,
      nursery: 0,
      romantic: 0,
      family_relationship: 0,
      free_time: 0,
      social_outing: 0,
      weekday_alcohol: 0,
      weekend_alcohol: 0,
      health_status: 0,
      school_name_MS: 0,
      mother_job_health: 0,
      mother_job_other: 0,
      mother_job_services: 0,
      mother_job_teacher: 0,
      father_job_health: 0,
      father_job_other: 0,
      father_job_services: 0,
      father_job_teacher: 0,
      school_reason_home: 0,
      school_reason_other: 0,
      school_reason_reputation: 0,
      primary_guardian_mother: 0,
      primary_guardian_other: 0,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Store results in sessionStorage for the results page
        sessionStorage.setItem('predictionResult', JSON.stringify(result));
        navigate('/results');
      } else {
        toast.error(`Prediction Failed: ${result.detail || 'Internal Server Error'}`);
      }
    } catch (error) {
      toast.error('Could not connect to the Prediction Server. Please ensure the backend is running!');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
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

        <Card className="p-8 shadow-strong">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Student Information</h1>
            <p className="text-muted-foreground">
              Please provide the following information to generate a performance prediction
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Previous Grade (G1) */}
            <div className="space-y-2">
              <Label htmlFor="grade_period1_input">Previous Grade (G1)</Label>
              <Input
                id="grade_period1_input"
                type="number"
                min="0"
                max="20"
                value={g1}
                onChange={(e) => setG1(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">Grade from previous period (0-20)</p>
            </div>

            {/* Current Grade (G2) */}
            <div className="space-y-2">
              <Label htmlFor="grade_period2_input">Current Grade (G2)</Label>
              <Input
                id="grade_period2_input"
                type="number"
                min="0"
                max="20"
                value={g2}
                onChange={(e) => setG2(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">Current period grade (0-20)</p>
            </div>

            {/* Weekly Study Hours */}
            <div className="space-y-4">
              <Label htmlFor="study_time_input">Weekly Study Hours: {studyTime}</Label>
              <Slider
                id="study_time_input"
                min={1}
                max={4}
                step={1}
                value={[studyTime]}
                onValueChange={(value) => setStudyTime(value[0])}
              />
              <p className="text-xs text-muted-foreground">1: &lt;2 hours, 2: 2-5 hours, 3: 5-10 hours, 4: &gt;10 hours</p>
            </div>

            {/* Total Absences */}
            <div className="space-y-2">
              <Label htmlFor="absences_input">Total Absences</Label>
              <Input
                id="absences_input"
                type="number"
                min="0"
                value={absences}
                onChange={(e) => setAbsences(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">Number of school absences</p>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age_input">Age</Label>
              <Input
                id="age_input"
                type="number"
                min="15"
                max="22"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">Student's age (15-22)</p>
            </div>

            {/* Mother's Education */}
            <div className="space-y-4">
              <Label htmlFor="mother_education_input">Mother's Education Level: {motherEd}</Label>
              <Slider
                id="mother_education_input"
                min={0}
                max={4}
                step={1}
                value={[motherEd]}
                onValueChange={(value) => setMotherEd(value[0])}
              />
              <p className="text-xs text-muted-foreground">0: None, 1: Primary, 2: Middle, 3: Secondary, 4: Higher</p>
            </div>

            {/* Father's Education */}
            <div className="space-y-4">
              <Label htmlFor="father_education_input">Father's Education Level: {fatherEd}</Label>
              <Slider
                id="father_education_input"
                min={0}
                max={4}
                step={1}
                value={[fatherEd]}
                onValueChange={(value) => setFatherEd(value[0])}
              />
              <p className="text-xs text-muted-foreground">0: None, 1: Primary, 2: Middle, 3: Secondary, 4: Higher</p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internet_input"
                  checked={internet}
                  onCheckedChange={(checked) => setInternet(checked as boolean)}
                />
                <Label htmlFor="internet_input" className="cursor-pointer">Has Internet Access at Home</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="higher_input"
                  checked={higher}
                  onCheckedChange={(checked) => setHigher(checked as boolean)}
                />
                <Label htmlFor="higher_input" className="cursor-pointer">Wants to Pursue Higher Education</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paid_input"
                  checked={paid}
                  onCheckedChange={(checked) => setPaid(checked as boolean)}
                />
                <Label htmlFor="paid_input" className="cursor-pointer">Takes Paid Extra Classes</Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 shadow-strong h-12"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                'Generate Prediction'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PredictionForm;
