import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SaveDialogProps = {
    open: boolean;
};

export default function SaveDialog({ open }: SaveDialogProps) {
    return (
        <Dialog open={open}>
            <DialogContent className="m-0 flex h-screen max-w-none flex-col justify-between overflow-y-auto rounded-none border-none p-6 sm:max-w-300 lg:w-[90%]">
                <DialogHeader>
                    <DialogTitle>Create Personnel Profile</DialogTitle>
                    <DialogDescription>
                        Fill in the information below to register new personnel.
                        Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => e.preventDefault()}>
                    <FieldGroup className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                        {/* --- PRIMARY DETAILS --- */}
                        <Field>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="John"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="John"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                                id="middleName"
                                name="middleName"
                                placeholder="Doe"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Smith"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="serialNumber">Serial Number</Label>
                            <Input
                                id="serialNumber"
                                name="serialNumber"
                                placeholder="SN-12345"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john.smith@example.com"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="contactNo">Contact Number</Label>
                            <Input
                                id="contactNo"
                                name="contactNo"
                                placeholder="+1 (555) 000-0000"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="birthday">Birthday</Label>
                            <Input id="birthday" name="birthday" type="date" />
                        </Field>

                        <Field>
                            <Label htmlFor="religion">Religion</Label>
                            <Input
                                id="religion"
                                name="religion"
                                placeholder="Christianity, Islam, etc."
                            />
                        </Field>

                        {/* --- SERVICE / RANK INFO --- */}
                        <Field>
                            <Label htmlFor="rankId">Rank</Label>
                            <select
                                id="rankId"
                                name="rankId"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <option value="">Select Rank...</option>
                                <option value="1">
                                    Rank Level 1 (e.g., Private)
                                </option>
                                <option value="2">
                                    Rank Level 2 (e.g., Sergeant)
                                </option>
                                <option value="3">
                                    Rank Level 3 (e.g., Captain)
                                </option>
                            </select>
                        </Field>

                        <Field>
                            <Label htmlFor="employmentStatus">
                                Employment Status
                            </Label>
                            <select
                                id="employmentStatus"
                                name="employmentStatus"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <option value="">Select Status...</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Retired">Retired</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </Field>

                        <Field>
                            <Label htmlFor="dateEnlisted">Date Enlisted</Label>
                            <Input
                                id="dateEnlisted"
                                name="dateEnlisted"
                                type="date"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dateEnteredService">
                                Date Entered Service
                            </Label>
                            <Input
                                id="dateEnteredService"
                                name="dateEnteredService"
                                type="date"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="dateOfLastPromotion">
                                Date of Last Promotion
                            </Label>
                            <Input
                                id="dateOfLastPromotion"
                                name="dateOfLastPromotion"
                                type="date"
                            />
                        </Field>

                        {/* --- PHYSICAL CHARACTERISTICS --- */}
                        <Field>
                            <Label htmlFor="bloodType">Blood Type</Label>
                            <select
                                id="bloodType"
                                name="bloodType"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <option value="">Select Blood Type...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </Field>

                        <Field>
                            <Label htmlFor="height">Height</Label>
                            <Input
                                id="height"
                                name="height"
                                placeholder="e.g., 175 cm"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="weight">Weight</Label>
                            <Input
                                id="weight"
                                name="weight"
                                placeholder="e.g., 70 kg"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="eyeColor">Eye Color</Label>
                            <Input
                                id="eyeColor"
                                name="eyeColor"
                                placeholder="Brown, Blue, etc."
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="hairColor">Hair Color</Label>
                            <Input
                                id="hairColor"
                                name="hairColor"
                                placeholder="Black, Blonde, etc."
                            />
                        </Field>

                        {/* Full-width elements spanning across both columns */}
                        <Field className="sm:col-span-2">
                            <Label htmlFor="identifyingMarks">
                                Identifying Marks
                            </Label>
                            <Input
                                id="identifyingMarks"
                                name="identifyingMarks"
                                placeholder="Scar on left forearm, mole on right cheek, etc."
                            />
                        </Field>

                        <Field className="sm:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="123 Main St, City, Country"
                            />
                        </Field>

                        {/* --- EMERGENCY CONTACT --- */}
                        <Field>
                            <Label htmlFor="emergencyContactPerson">
                                Emergency Contact Person
                            </Label>
                            <Input
                                id="emergencyContactPerson"
                                name="emergencyContactPerson"
                                placeholder="Jane Smith"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="emergencyContactNo">
                                Emergency Contact No.
                            </Label>
                            <Input
                                id="emergencyContactNo"
                                name="emergencyContactNo"
                                placeholder="+1 (555) 999-9999"
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save Personnel</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
