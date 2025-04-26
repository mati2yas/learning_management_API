import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Head } from "@inertiajs/react"
import { InfoIcon } from "lucide-react"

const VerifyAlreadyVerified = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head title="Email Verified!" />
      <Card className="w-full max-w-md">
        <CardHeader>

          <div className="flex justify-center mb-4">
            <InfoIcon className="w-16 h-16 text-blue-500" />
          </div>

          <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center mb-4">
        Your email has already been verified. There's no need for further action.
      </p>
      <p className="text-foreground font-semibold text-center">You can proceed to log in using our mobile app.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyAlreadyVerified
