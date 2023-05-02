import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { TABLE_ID } from "./const";

type TableEnv = {
  tableEnv: {
    collectionIds: Record<string, any>;
  };
};

export async function getSchema() {
  const schemaRef = doc(db, `_rowy_/settings/schema/${TABLE_ID}`);
  const schema = await getDoc(schemaRef);
  return schema.data() as TableEnv;
}
