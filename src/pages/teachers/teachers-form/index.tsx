import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Container,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface FormField {
  name: string;
  label: string;
  type: string;
}

interface TeacherData {
  name: string;
  email: string;
  phone: string;
  subjects: string[];
}

interface Subject {
  _id: string;
  name: string;
}

const formFields: FormField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
];

const AddTeacherForm = () => {
  const [teacherData, setTeacherData] = useState<TeacherData>({
    name: "",
    email: "",
    phone: "",
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
    setTeacherData({ ...teacherData, [event.target.name]: event.target.value });
  };

  const renderSelectedSubjects = (selectedSubjectIds: string[]) => {
    const selectedSubjectNames = selectedSubjectIds.map(
      (id) => subjects.find((subject) => subject._id === id)?.name || ""
    );
    return selectedSubjectNames.join(", ");
  };

  const handleSubjectChange = (event: SelectChangeEvent<string[]>) => {
    setTeacherData({
      ...teacherData,
      subjects: event.target.value as string[],
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      ...teacherData,
    };

    try {
      const response = await fetch("/api/v1/teachers", {
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
      console.log(result);
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
            value={teacherData[name as keyof TeacherData]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
          />
        ))}
        <FormControl fullWidth margin="normal">
          <InputLabel id="subjects-label">Subjects</InputLabel>
          <Select
            labelId="subjects-label"
            id="subjects"
            multiple
            value={teacherData.subjects}
            onChange={handleSubjectChange}
            input={<OutlinedInput label="Subjects" />}
            renderValue={(selected) =>
              renderSelectedSubjects(selected as string[])
            }
          >
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                <Checkbox
                  checked={teacherData.subjects.includes(subject._id)}
                />
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

export default AddTeacherForm;
