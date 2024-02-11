import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'

const CourseYearTabs = ({}) => {
  return (
    <Tabs defaultValue="1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="1">Account</TabsTrigger>
        <TabsTrigger value="2 ">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="1">Make changes to your account here.</TabsContent>
      <TabsContent value="2">Change your password here.</TabsContent>
    </Tabs>
  )
}
