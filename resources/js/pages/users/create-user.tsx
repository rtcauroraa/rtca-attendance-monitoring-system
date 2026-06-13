import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Head } from "@inertiajs/react"

export default function CreateUser() {

  return (



    <>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 px-10">
        <div className="w-full max-w-md">
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Personal Information</FieldLegend>
               
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                      Name
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-card-name-43j"
                      placeholder="Name"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                      Birthday
                    </FieldLabel>
                    <Input
                      type="date"
                      id="checkout-7j9-card-number-uw1"
                      placeholder="1234 5678 9012 3456"
                      required
                    />

                  </Field>
                 
                    <Field>
                      <FieldLabel htmlFor="checkout-exp-month-ts6">
                        Religion
                      </FieldLabel>
                      <Select defaultValue="">
                        <SelectTrigger id="checkout-exp-month-ts6">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                              ['Roman Catholic', 'Islam'].map(label => <SelectItem value={label}>{label}</SelectItem>)
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                        Address
                      </FieldLabel>
                      <Textarea />

                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-7j9-cvv">Contact No.</FieldLabel>
                      <Input id="checkout-7j9-cvv" placeholder="123" required />
                    </Field>
                
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Emergency Contact Persson</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Email</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123" type="email" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-exp-month-ts6">
                      Status
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-exp-month-ts6">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            ['Single', 'Married', 'Widowed'].map(label => <SelectItem value={label}>{label}</SelectItem>)
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-exp-month-ts6">
                      Blood Type
                    </FieldLabel>
                    <Select defaultValue="">
                      <SelectTrigger id="checkout-exp-month-ts6">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            ['A', 'A+', 'B', 'B+', 'AB', 'O', 'O+'].map(label => <SelectItem value={label}>{label}</SelectItem>)
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Height (cm)</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123" type="number"  required />
                  </Field>

                   <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Weight (kg)</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123" type="number"  required />
                  </Field>


                 <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Identifying Marks</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123"  required />
                  </Field>


                 <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Eye Color</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123"  required />
                  </Field>


                 <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv">Hair Color</FieldLabel>
                    <Input id="checkout-7j9-cvv" placeholder="123"  required />
                  </Field>


                </FieldGroup>
              </FieldSet>


              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  );


}
