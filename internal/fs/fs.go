package fs

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
)

type FileNode struct {
	Name    string     `json:"name"`
	Path    string     `json:"path"`
	IsDir   bool       `json:"dir"`
	Files   []FileNode `json:"files,omitempty"`
	Folders []FileNode `json:"folders,omitempty"`
}

func GetWorkspace(workspace string) (FileNode, error) {
	var root FileNode

	info, err := os.Stat(workspace)
	if err != nil {
		return FileNode{}, err
	}

	root.IsDir = true
	root.Name = info.Name()
	root.Path = ""

	return root, nil
}

// check if target path exists under the workspace path.
func validatePath(workspace string, targetPath string) (string, error) {
	absTarget, err := filepath.Abs(filepath.Join(workspace, targetPath))
	if err != nil {
		return "", err
	}

	absTarget = filepath.Clean(absTarget)

	valid := strings.HasPrefix(absTarget, workspace)

	if !valid {
		return "", errors.New("invalid path")
	}

	return absTarget, nil
}

// get directory contents - one level.
func ReadWorkspaceFolder(workspace string, filePath string) (FileNode, error) {
	dirPath, err := validatePath(workspace, filePath)
	if err != nil {
		return FileNode{}, err
	}

	entries, _ := os.ReadDir(dirPath)

	result := FileNode{
		IsDir:   true,
		Files:   []FileNode{},
		Folders: []FileNode{},
	}

	for _, entry := range entries {
		if strings.HasPrefix(entry.Name(), ".") {
			continue
		}
		filePath, err := filepath.Rel(workspace, filepath.Join(dirPath, entry.Name()))
		if err != nil {
			// log.Printf("error: %s", err.Error())
			continue
		}
		node := FileNode{
			Path:  filePath,
			Name:  entry.Name(),
			IsDir: entry.IsDir(),
		}
		if node.IsDir {
			result.Folders = append(result.Folders, node)
		} else {
			result.Files = append(result.Files, node)
		}
	}

	return result, nil
}

// read a file in the workspace.
func ReadWorkspaceFile(workspace string, filePath string) (string, error) {
	fp, err := validatePath(workspace, filePath)
	if err != nil {
		return "", err
	}

	content, err := os.ReadFile(fp)
	if err != nil {
		return "", err
	}

	return string(content), nil
}

// write a file in the workspace.
const PERM_WRITE_FILE int = 0600

func WriteWorkspaceFile(workspace string, filePath string, content string) error {
	fp, err := validatePath(workspace, filePath)
	if err != nil {
		return err
	}

	err = os.WriteFile(fp, []byte(content), os.FileMode(PERM_WRITE_FILE))
	if err != nil {
		return err
	}

	return nil
}

// create a file in the workspace.
const PERM_CREATE_DIR int = 0750

func CreateWorkspaceFile(workspace string, dirPath string, fileName string) error {
	fp, err := validatePath(workspace, dirPath)
	if err != nil {
		return err
	}

	filePath := filepath.Join(fp, fileName)

	if _, err := os.Stat(filePath); err != nil {
		if os.IsExist(err) {
			return errors.New("file already exists")
		}
		return err
	}

	baseDir := filepath.Dir(filePath)

	_, err = os.Stat(baseDir)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(baseDir, os.FileMode(PERM_CREATE_DIR)); err != nil {
				return err
			}
		}
	}

	err = os.WriteFile(filePath, []byte(""), os.FileMode(PERM_WRITE_FILE))
	if err != nil {
		return err
	}

	return nil
}

// delete a file in the workspace.
func RemoveWorkspaceFile(workspace string, filePath string) error {
	fp, err := validatePath(workspace, filePath)
	if err != nil {
		return err
	}

	if err := os.Remove(fp); err != nil {
		return err
	}

	return nil
}

// rename a file in the workspace.
func RenameWorkspaceFile(workspace string, oldPath string, newName string) error {
	newPath := filepath.Join(filepath.Dir(oldPath), newName)

	op, err := validatePath(workspace, oldPath)
	if err != nil {
		return err
	}

	np := filepath.Join(workspace, newPath)
	if !strings.HasPrefix(np, workspace) {
		return errors.New("invalid path")
	}

	err = os.Rename(op, np)
	if err != nil {
		return err
	}

	return nil
}
