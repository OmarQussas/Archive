import axios from "axios";
import { TOKEN, DOMAIN } from "../config";

export async function getArchiveData(filters) {
  const {
    page,
    directory_name,
    subject_name,
    status,
    date_from,
    date_to,
    code,
    about_name,
  } = filters;
  const default_from = "1970-01-01";
  const default_to = "2090-01-01";

  try {
    const res = await axios.get(`${DOMAIN}/api/v1/archive/getByFilter`, {
      params: {
        page,
        directory_name,
        subject_name,
        about_name,
        status,
        code,
        date_from: date_from
          ? date_from.toISOString().slice(0, 10)
          : default_from,
        date_to: date_to ? date_to.toISOString().slice(0, 10) : default_to,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    console.log("archives are");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDirectories() {
  try {
    const res = await axios.get(` ${DOMAIN}/api/v1/directory/getAll`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllSubjects() {
  try {
    const res = await axios.get(` ${DOMAIN}/api/v1/subject/getAll`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`, // Include TOKEN in the request headers
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllDirectories() {
  try {
    const res = await axios.get(`${DOMAIN}/api/v1/directory/getAll`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`, // Include TOKEN in the request headers
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
