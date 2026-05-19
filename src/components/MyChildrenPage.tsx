import { motion } from "motion/react";
import { Plus, Palette, Calendar } from "lucide-react";
import { DeleteChildButton } from "./DeleteChildButton";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export interface Child {
  id: string;
  name: string;
  age: number;
  birthdate: string;
  artworkCount?: number;
  avatarColor: string;
}

type MyChildrenPageProps = {
  children: Child[];
  onAddChild: (payload: { name: string; birthdate: string }) => Promise<void>;
  onDeleteChild: (childId: string) => Promise<void>;
};

export function MyChildrenPage({
  children,
  onAddChild,
  onDeleteChild,
}: MyChildrenPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildBirthdate, setNewChildBirthdate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddChild = async () => {
    if (!newChildName || !newChildBirthdate) return;
    // validate birthdate: cannot be in the future and age must be <= 24
    const picked = dayjs(newChildBirthdate);
    if (picked.isAfter(dayjs())) {
      toast.error("The birthdate cannot be in the future");
      return;
    }
    const age = dayjs().diff(picked, "year");
    if (age > 24) {
      toast.error("The child must be 24 years old or younger");
      return;
    }
    setIsSubmitting(true);
    try {
      await onAddChild({ name: newChildName, birthdate: newChildBirthdate });
      setShowAddForm(false);
      setNewChildName("");
      setNewChildBirthdate("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="font-[var(--font-family-heading)] text-5xl mb-4">
            My Little Artists 🎨
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your children's profiles and view their creative journey
          </p>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {children.map((child) => (
            <motion.div
              key={child.id}
              className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all cursor-pointer relative"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Delete button placed absolutely to avoid being inside the Link */}
              <div className="absolute top-4 right-4 z-50">
                <DeleteChildButton
                  childId={child.id}
                  childName={child.name}
                  onDelete={onDeleteChild}
                />
              </div>

              <Link to={`/child/${child.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: child.avatarColor }}
                  >
                    {child.name.charAt(0)}
                  </div>
                </div>

                <h3 className="font-[var(--font-family-heading)] text-2xl mb-2">
                  {child.name}
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{child.age} years old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>{child.artworkCount ?? 0} masterpieces</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Born {child.birthdate}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Add Child Card */}
          {!showAddForm ? (
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="bg-muted hover:bg-muted/80 rounded-3xl p-6 border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-[250px]"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <span className="font-[var(--font-family-heading)] text-xl">
                Add a child
              </span>
            </motion.button>
          ) : (
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="font-[var(--font-family-heading)] text-xl mb-4">
                Add New Child
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 rounded-2xl bg-input-background border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Birthdate</label>
                  <div className="flex items-center gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={
                          newChildBirthdate ? dayjs(newChildBirthdate) : null
                        }
                        onChange={(newValue) => {
                          if (!newValue) {
                            setNewChildBirthdate("");
                            return;
                          }
                          const val = (newValue as any).format("YYYY-MM-DD");
                          setNewChildBirthdate(val);
                        }}
                        slotProps={{
                          yearButton: {
                            sx: {
                              fontFamily: "Nunito, sans-serif !important",
                              fontSize: "12px !important",
                              "&.Mui-selected": {
                                backgroundColor: "#FFB7C5 !important",
                                color: "#3D3250 !important",
                                fontFamily: "Nunito, sans-serif !important",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "#C9B8F0 !important",
                              },
                              "&.Mui-selected:focus": {
                                backgroundColor: "#FFB7C5 !important",
                              },
                            },
                          },
                          textField: {
                            sx: {
                              "& .MuiPickersOutlinedInput-sectionsContainer": {
                                fontFamily: "Nunito, sans-serif !important",
                              },

                              "& .MuiPickersSectionList-section": {
                                fontFamily: "Nunito, sans-serif !important",
                              },

                              "& .MuiPickersSectionList-sectionContent": {
                                fontFamily: "Nunito, sans-serif !important",
                              },
                            },
                          },
                          day: {
                            sx: {
                              fontFamily: "Nunito, sans-serif !important",
                              "&.Mui-selected": {
                                backgroundColor: "#FFB7C5 !important",
                                color: "#3D3250 !important",
                                fontFamily: "Nunito, sans-serif !important",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "#C9B8F0 !important",
                              },
                              "&.Mui-selected:focus": {
                                backgroundColor: "#FFB7C5 !important",
                              },

                              "&.MuiPickersDay-today:not(.Mui-selected)": {
                                border: "1.5px solid #FFB7C5 !important",
                                color: "#3D3250 !important",
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => void handleAddChild()}
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {isSubmitting ? "Saving..." : "Add"}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
