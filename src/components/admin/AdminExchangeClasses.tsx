import useAdminClasses from "../../hooks/admin/useAdminClasses"
import { useState, useMemo, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '../ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";

export const AdminExchangeClasses = () => {
  const { classes, loading} = useAdminClasses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [selectedCourseUnitId, setSelectedCourseUnitId] = useState<string>("all");
  
  const courses = useMemo(() => {
    if (!classes) return [];
    
    const uniqueCourses = new Map();
    
    uniqueCourses.set("all", { id: "all", acronym: "Todos" });
    
    classes.forEach((cls: any) => {
      const courseId = cls.course_id;
      const courseAcronym = cls.course_acronym;
      
      if (courseId && !uniqueCourses.has(courseId.toString())) {
        uniqueCourses.set(courseId.toString(), { 
          id: courseId.toString(), 
          acronym: courseAcronym 
        });
      }
    });
    
    return Array.from(uniqueCourses.values());
  }, [classes]);
  
  const courseUnits = useMemo(() => {
    if (!classes) return [];
    
    const uniqueCourseUnits = new Map();
    
    uniqueCourseUnits.set("all", { 
      id: "all", 
      acronym: "Todas", 
      courseAcronym: "",
      displayText: "Todas" 
    });
    
    const relevantClasses = selectedCourseId === "all" 
      ? classes 
      : classes.filter((cls: any) => {
          const courseId = cls.course_id;
          return courseId && courseId.toString() === selectedCourseId;
        });
    
    relevantClasses.forEach((cls: any) => {
      const courseUnitId = cls.course_unit_id;
      const courseUnitAcronym = cls.course_unit_acronym;
      const courseAcronym = cls.course_acronym;
      
      if (courseUnitId && !uniqueCourseUnits.has(courseUnitId.toString())) {
        uniqueCourseUnits.set(courseUnitId.toString(), { 
          id: courseUnitId.toString(), 
          acronym: courseUnitAcronym,
          courseAcronym: courseAcronym,
          displayText: courseUnitAcronym && courseAcronym ? 
            `${courseUnitAcronym} (${courseAcronym})` : 
            courseUnitAcronym || `CU${courseUnitId}`
        });
      }
    });
    
    const unsortedCourseUnits = Array.from(uniqueCourseUnits.values());
    
    const allOption = unsortedCourseUnits.find(unit => unit.id === "all");
    const sortedRest = unsortedCourseUnits
      .filter(unit => unit.id !== "all")
      .sort((a, b) => {
        const acronymA = a.acronym || '';
        const acronymB = b.acronym || '';
        return acronymA.localeCompare(acronymB, 'pt');
      });
    
    return allOption ? [allOption, ...sortedRest] : sortedRest;
  }, [classes, selectedCourseId]);
  
  useEffect(() => {
    setSelectedCourseUnitId("all");
  }, [selectedCourseId]);
  
  const filteredClasses = useMemo(() => {
    if (!classes) return [];
    
    return classes.filter((cls: any) => {
      const courseId = cls.course_id;
      const courseUnitId = cls.course_unit_id;
      
      const courseMatches = selectedCourseId === "all" || 
        (courseId && courseId.toString() === selectedCourseId);
      
      const courseUnitMatches = selectedCourseUnitId === "all" || 
        (courseUnitId && courseUnitId.toString() === selectedCourseUnitId);
      
      return courseMatches && courseUnitMatches;
    });
  }, [classes, selectedCourseId, selectedCourseUnitId]);
  
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Vagas</h1>
      </div>
      {loading && <BarLoader className="w-full" />}
      {!loading && classes && classes.length === 0 && (
        <div className="text-center text-gray-500">Nenhuma turma disponível.</div>
      )}
      {!loading && classes && classes.length > 0 && (
        <>
          <div className="space-y-4 mb-6">
            <Tabs 
              value={selectedCourseId} 
              onValueChange={setSelectedCourseId}
              className="w-full"
            >
              <TabsList className="w-full flex h-auto p-1">
                {courses.map(course => (
                  <TabsTrigger 
                    key={course.id} 
                    value={course.id}
                    className="flex-grow data-[state=active]:bg-primary data-[state=active]:text-white"
                    title={course.acronym}
                  >
                    {course.acronym}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="w-full">
              <div className="text-sm font-medium mb-1.5">Filtrar por cadeira:</div>
              <Select
                value={selectedCourseUnitId}
                onValueChange={setSelectedCourseUnitId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a cadeira" />
                </SelectTrigger>
                <SelectContent>
                  {courseUnits.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Curso</TableHead>
                  <TableHead className="font-semibold">Cadeira</TableHead>
                  <TableHead className="font-semibold">Vagas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls: any) => (
                    <TableRow key={cls.classId} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.course_acronym ?? 'NA'}</TableCell>
                      <TableCell>{cls.course_unit_acronym ?? 'NA'}</TableCell>
                      <TableCell>{cls.vacancies ?? 'NA'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nenhuma turma encontrada para este curso.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

