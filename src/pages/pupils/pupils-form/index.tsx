import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface FormField {
  name: string;
  label: string;
  type: string;
}

interface PupilData {
  name: string;
  email: string;
  dob: string;
  age: string;
  gender: string;
  phone: string;
  tutor: string;
  tutorContact: string;
  subjects: string[];
}

interface Subject {
  _id: string;
  name: string;
}

const formFields: FormField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "age", label: "Age", type: "number" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "tutor", label: "Tutor", type: "text" },
  { name: "tutorContact", label: "Tutor Contact", type: "tel" },
];

const AddPupilForm = () => {
  const [pupilData, setPupilData] = useState<PupilData>({
    name: "",
    email: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    tutor: "",
    tutorContact: "",
    subjects: [],
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/v1/subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPupilData({ ...pupilData, [event.target.name]: event.target.value });
  };

  const renderSelectedSubjects = (selectedSubjectIds: string[]) => {
    const selectedSubjectNames = selectedSubjectIds.map(
      (id) => subjects.find((subject) => subject._id === id)?.name || ""
    );
    return selectedSubjectNames.join(", ");
  };

  const handleSubjectChange = (event: SelectChangeEvent<string[]>) => {
    setPupilData({ ...pupilData, subjects: event.target.value as string[] });
  };

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPupilData({ ...pupilData, gender: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare data for submission
    const data = {
      ...pupilData,
      age: parseInt(pupilData.age, 10), // Ensure age is sent as a number
    };

    // Log the data being sent to check if gender is included
    console.log("Data being sent:", data);

    try {
      const response = await fetch("/api/v1/pupils", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Response from server:", result);
      // Optionally reset the form or give user feedback
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      // Handle the error state
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {formFields.map(({ name, label, type }) => (
          <TextField
            key={name}
            name={name}
            label={label}
            type={type}
            value={pupilData[name as keyof PupilData]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
          />
        ))}
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={pupilData.gender}
            onChange={handleGenderChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="subjects-label">Subjects</InputLabel>
          <Select
            labelId="subjects-label"
            id="subjects"
            multiple
            value={pupilData.subjects}
            onChange={handleSubjectChange}
            input={<OutlinedInput label="Subjects" />}
            renderValue={(selected) =>
              renderSelectedSubjects(selected as string[])
            }
          >
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                <Checkbox checked={pupilData.subjects.includes(subject._id)} />
                <ListItemText primary={subject.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="bg-black	mt-2"
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AddPupilForm;
