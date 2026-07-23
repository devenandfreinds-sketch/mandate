import { useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { useCreateUser, useUpdateUser, useUsers } from "@/hooks/useUsers";
import { USER_ROLES, CERTIFICATION_LEVELS, AFFILIATIONS } from "@mandate/shared";
import type { User } from "@mandate/shared";

/**
 * Manages the researcher roster (see docs/MANDATE_OPERATING_SYSTEM.md, "User model" and
 * "Researcher Certification"). Adding someone here does NOT give them login access — everyone
 * still shares the one admin password. This page exists so a real name can be attached to
 * ResearchTask/PipelineAssessment rows for attribution and review-routing, instead of free text.
 */
export function AdminUsersPage() {
  const logout = useAdminLogout();
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("internal");
  const [role, setRole] = useState("researcher");
  const [certificationLevel, setCertificationLevel] = useState("new_researcher");
  const [error, setError] = useState<string | null>(null);

  function handleCreate() {
    setError(null);
    createUser.mutate(
      { name, email, affiliation, role, certificationLevel },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setAffiliation("internal");
          setRole("researcher");
          setCertificationLevel("new_researcher");
        },
        onError: (err) => setError(err instanceof Error ? err.message : "Failed to create user"),
      }
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Researchers</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/research-queue" className="text-sm text-muted-foreground hover:underline">
            ← Research Queue
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout.mutate()}>
            Log out
          </Button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        The roster of real people who can be assigned tasks, act as reviewer, or be attributed on research. This
        is identity, not login — everyone still authenticates with the one shared admin password. Affiliation
        (internal/external) is who they are to the organization; role is what they're capable of doing — the two
        are independent (see docs/MANDATE_RESEARCH_NETWORK.md). See{" "}
        <Link to="/admin/research-queue" className="underline">
          the Research Queue
        </Link>{" "}
        to assign work to someone listed here.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add a researcher</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm" />
          </Field>
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm" />
          </Field>
          <Field label="Affiliation">
            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              {AFFILIATIONS.map((a) => (
                <option key={a.affiliation} value={a.affiliation}>
                  {a.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Role">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm">
              {USER_ROLES.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Certification level">
            <select
              value={certificationLevel}
              onChange={(e) => setCertificationLevel(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              {CERTIFICATION_LEVELS.map((c) => (
                <option key={c.level} value={c.level}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-5">
            <Button size="sm" onClick={handleCreate} disabled={!name || !email || createUser.isPending}>
              {createUser.isPending ? "Adding…" : "Add researcher"}
            </Button>
            {error && <span className="ml-3 text-sm text-destructive">{error}</span>}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && (users?.length ?? 0) === 0 && <p className="p-4 text-sm text-muted-foreground">No researchers added yet.</p>}
        {(users?.length ?? 0) > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Affiliation</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users!.map((u) => (
                <UserRow key={u.id} user={u} onUpdate={updateUser.mutate} />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}

function UserRow({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (payload: { id: string; affiliation?: string; role?: string; certificationLevel?: string; isActive?: boolean }) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
      <TableCell>
        <select
          value={user.affiliation}
          onChange={(e) => onUpdate({ id: user.id, affiliation: e.target.value })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          {AFFILIATIONS.map((a) => (
            <option key={a.affiliation} value={a.affiliation}>
              {a.label}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <select
          value={user.role}
          onChange={(e) => onUpdate({ id: user.id, role: e.target.value })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          {USER_ROLES.map((r) => (
            <option key={r.role} value={r.role}>
              {r.label}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <select
          value={user.certificationLevel}
          onChange={(e) => onUpdate({ id: user.id, certificationLevel: e.target.value })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          {CERTIFICATION_LEVELS.map((c) => (
            <option key={c.level} value={c.level}>
              {c.label}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <Badge
          variant={user.isActive ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onUpdate({ id: user.id, isActive: !user.isActive })}
        >
          {user.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
