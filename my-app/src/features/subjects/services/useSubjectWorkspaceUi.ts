import { useCallback, useMemo, useState } from "react";
import {
  SUBJECT_LIST_MOCK,
  type SubjectListItem,
} from "@/features/subjects/services/subjectWorkspaceMock";

export function useSubjectWorkspaceUi() {
  const [selectedId, setSelectedId] = useState<string>(SUBJECT_LIST_MOCK[0]?.id ?? "");

  const selected = useMemo(
    () => SUBJECT_LIST_MOCK.find((s) => s.id === selectedId) ?? SUBJECT_LIST_MOCK[0],
    [selectedId],
  );

  const select = useCallback((row: SubjectListItem) => {
    setSelectedId(row.id);
  }, []);

  return {
    list: SUBJECT_LIST_MOCK,
    selected,
    selectedId,
    select,
  };
}
