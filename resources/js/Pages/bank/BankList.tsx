import React, { lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import { ChevronDown, ChevronUp, Building, CreditCard } from "lucide-react"

const LazyCreateBankAlert = lazy(() => import("./CreateBankAlert"))
const LazyEditBankAlert = lazy(() => import("./EditBankAlert"))
const LazyDeleteBankAlert = lazy(() => import("./DeleteBankAlert"))

interface Bank {
  id: number
  bank_name: string
  bank_account_number: number
}

interface BankListProps {
  banks: Bank[]
}

export function BankList({ banks }: BankListProps) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bank Accounts
          <div className="flex items-center space-x-2">
            <Suspense
              fallback={
                <Button variant="outline" size="sm" disabled>
                  Add Bank
                </Button>
              }
            >
              <LazyCreateBankAlert />
            </Suspense>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </CardTitle>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="grid gap-4">
            {banks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No bank accounts added yet. Click "Add Bank" to create one.
              </div>
            ) : (
              banks.map((bank) => (
                <Card key={bank.id} className="overflow-hidden group relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-semibold">{bank.bank_name}</p>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{bank.bank_account_number}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Suspense
                          fallback={
                            <Button variant="secondary" size="sm" disabled>
                              Edit
                            </Button>
                          }
                        >
                          <LazyEditBankAlert bank={bank} />
                        </Suspense>
                        <Suspense
                          fallback={
                            <Button variant="secondary" size="sm" disabled>
                              Delete
                            </Button>
                          }
                        >
                          <LazyDeleteBankAlert id={bank.id} bankName={bank.bank_name} />
                        </Suspense>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

