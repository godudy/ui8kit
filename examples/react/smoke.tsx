import {
  Alert,
  Breadcrumb,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  IconBadge,
  Nav,
  NavItem,
  NavLink,
  NavList,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components";
import {
  Badge,
  Button,
  Checkbox,
  Fieldset,
  Form,
  FormDescription,
  FormItem,
  FormMessage,
  Grid,
  GridCol,
  Input,
  Label,
  Link,
  Select,
  SelectOption,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Text,
  Title,
} from "../../ui";

export function ReactSmokeExample() {
  return (
    <div className="space-y-6">
      <Alert variant="info">Heads up: static smoke render.</Alert>

      <Grid cols="1-2" className="gap-4">
        <GridCol>
          <Card tag="article" variant="accent">
            <CardHeader>
              <CardTitle order={3}>Revenue</CardTitle>
              <CardDescription>Templ parity in TSX.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text tag="p">Quarterly growth stays positive.</Text>
            </CardContent>
            <CardFooter className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Action
              </Button>
              <Link href="/docs" variant="default">
                Docs
              </Link>
            </CardFooter>
          </Card>
        </GridCol>
        <GridCol>
          <Sheet id="smoke-sheet" open behavior="ui8kit" side="right" size="md">
            <SheetTrigger for="smoke-sheet" variant="default" size="sm">
              Open
            </SheetTrigger>
            <SheetContent id="smoke-sheet">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetClose for="smoke-sheet" variant="ghost" size="sm">
                  Close
                </SheetClose>
              </SheetHeader>
              <SheetDescription>Type-level smoke for sheet slots.</SheetDescription>
            </SheetContent>
          </Sheet>
        </GridCol>
      </Grid>

      <Form className="space-y-3">
        <FormItem>
          <Label htmlFor="name">Name</Label>
          <Input id="name" variant="default" size="md" />
          <FormDescription>Default text input type is preserved.</FormDescription>
          <FormMessage>Validation copy placeholder.</FormMessage>
        </FormItem>
        <Fieldset variant="default" size="sm" className="space-y-2">
          <Select variant="default" size="sm" defaultValue="a">
            <SelectOption value="a">A</SelectOption>
            <SelectOption value="b">B</SelectOption>
          </Select>
          <div className="flex items-center gap-2">
            <Checkbox defaultChecked />
            <Switch defaultChecked />
            <Badge variant="default">Checked</Badge>
          </div>
        </Fieldset>
      </Form>

      <Nav aria-label="Main">
        <NavList orientation="horizontal" gap="sm">
          <NavItem>
            <NavLink href="/" active>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/reports" variant="default" size="sm">
              Reports
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell scope="col">KPI</TableHeadCell>
            <TableHeadCell scope="col">Value</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Uptime</TableCell>
            <TableCell>99.9%</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Title order={4}>Extras</Title>
      <IconBadge name="sparkles" text="S" size="sm" />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Docs", current: true }]} />
    </div>
  );
}
